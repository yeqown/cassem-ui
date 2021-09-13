<template>
  <page-layout :desc="desc" :title="title">
    <div slot="action">
      <span>环境列表：</span>
      <template v-for="(env, index) in envs">
        <a-tag
          :key="index"
          :closable="true"
          @close="() => handleEnvDelete(env)"
          @click="handleEnvChange({ env })"
          :color="env === curEnv ? 'green' : ''"
          :dashed="env === curEnv ? false : true"
          type="primary"
        >
          {{ env }}
        </a-tag>
      </template>

      <a-input
        v-show="envInputVisible"
        ref="refInput"
        type="text"
        size="small"
        :style="{ width: '78px', 'margin-right': '10px' }"
        v-model="envInput"
        @blur="
          () => {
            this.envInputVisible = false;
          }
        "
        @keyup.enter="handleInputConfirm"
      />
      <a-tag
        v-if="!envInputVisible"
        style="background: #fff; borderstyle: dashed"
        size="middle"
        @click.prevent="handleFocusEnvInput"
      >
        <a-icon type="plus" /> 新增
      </a-tag>

      <a-dropdown>
        <a @click="(e) => e.preventDefault()">
          <a-icon type="ordered-list" />
        </a>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="newEle" disabled>
            <a-icon type="edit" />新增配置
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <div slot="headerContent" v-if="app">
      <detail-list :col="4">
        <detail-list-item term="应用ID">
          {{ app.id }}
        </detail-list-item>
        <detail-list-item term="应用创建者">
          {{ app.creator }}
        </detail-list-item>
        <detail-list-item term="应用所属者">
          {{ app.owner }}
        </detail-list-item>
        <detail-list-item term="应用创建时间">
          {{ new Date(app.createdAt * 1000).toLocaleString() }}
        </detail-list-item>
        <detail-list-item term="应用描述">
          {{ app.description }}
        </detail-list-item>
      </detail-list>
    </div>

    <a-list
      v-show="elements && elements.length"
      :grid="{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
      style="margin: 0 -8px"
    >
      <a-list-item
        v-for="(elem, index) in elements"
        :key="index"
        style="padding: 0 8px"
      >
        <a-card
          :hoverable="true"
          :title="elem.metadata.key || '获取中'"
          style="margin-bottom: 20px"
          size="small"
        >
          <div slot="extra">
            <a-tag v-if="elem.published" color="green" type="primary"
              >已发布</a-tag
            >
            <a @click="handleClickHistoryVersion(elem)">历史版本</a>
          </div>
          <detail-list :col="2">
            <detail-list-item term="使用中版本">
              <a v-if="elem.metadata.usingVersion !== 0">{{
                elem.metadata.usingVersion
              }}</a>
              <span v-else>-</span></detail-list-item
            >
            <detail-list-item term="最新版本"
              ><a v-if="elem.metadata.latestVersion !== 0">{{
                elem.metadata.latestVersion
              }}</a>
              <span v-else>-</span></detail-list-item
            >
            <detail-list-item term="待发布版本"
              ><a v-if="elem.metadata.unpublishedVersion !== 0">{{
                elem.metadata.unpublishedVersion
              }}</a>
              <span v-else>-</span>
            </detail-list-item>
            <detail-list-item term="配置项格式">{{
              CONTENT_TYPE_MAPPING[elem.metadata.contentType]
            }}</detail-list-item>
          </detail-list>
          <template slot="actions" class="ant-card-actions">
            <a-tooltip>
              <template slot="title"> 编辑 </template>
              <a-icon
                key="edit"
                type="edit"
                :style="{ color: '#40a9ff' }"
                @click="handleClickEdit(elem)"
              />
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> 发布 </template>
              <a-dropdown>
                <a-icon
                  key="pull-request"
                  type="pull-request"
                  :style="{ color: '#52c41a' }"
                />
                <a-menu slot="overlay">
                  <a-menu-item
                    @click="handlePublishAppVersion(elem, PUBLISH_MODE_ALL)"
                  >
                    <a-icon type="robot" /> 全量发布</a-menu-item
                  >
                  <a-menu-item
                    @click="handlePublishAppVersion(elem, PUBLISH_MODE_GRAY)"
                  >
                    <a-icon type="monitor" /> 灰度发布</a-menu-item
                  >
                </a-menu>
              </a-dropdown> </a-tooltip
            ><a-tooltip>
              <template slot="title"> 回滚 </template>
              <a-icon
                key="rollback"
                type="rollback"
                :style="{ color: '#40a9ff' }"
                @click="
                  () => {
                    this.$message.info('编辑功能暂未开放，敬请期待');
                  }
                "
              /> </a-tooltip
            ><a-tooltip>
              <template slot="title"> 删除 </template>
              <a-popconfirm
                title="确认要删除这个配置项吗"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDeleteAppEnvElement(elem.metadata.key)"
              >
                <a-icon
                  key="delete"
                  type="delete"
                  theme="twoTone"
                  two-tone-color="#eb2f96"
                />
              </a-popconfirm>
            </a-tooltip>
          </template>
        </a-card>
      </a-list-item>

      <a-list-item>
        <a-card :hoverable="true">
          <a-button
            size="large"
            type="dashed"
            style="height: 136px; width: 100%"
            @click="
              () => {
                this.$router.push({
                  path: `/application/detail/${appId}/new`,
                  query: { env: curEnv },
                });
              }
            "
          >
            <a-icon
              type="plus"
              :style="{ fontSize: '2em', color: '#52c41a' }"
            />
          </a-button>
        </a-card>
      </a-list-item>
    </a-list>
    <div v-if="!(elements && elements.length)" class="exception-page">
      <img
        class="img"
        src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg"
      />
      <span>没啥可加载，</span>
      <a
        @click="
          () => {
            this.$router.push({
              path: `/application/detail/${appId}/new`,
              query: { env: curEnv },
            });
          }
        "
        >去新增吧</a
      >
    </div>
  </page-layout>
</template>

<script>
import DetailList from "../../../components/tool/DetailList";
import PageLayout from "../../../layouts/PageLayout";
import { CONTENT_TYPE_MAPPING } from "../config";

const DetailListItem = DetailList.Item;
const LIMIT = 100;

import {
  createAppEnv,
  getApp,
  getAppElements,
  getAppEnvs,
  deleteAppEnv,
  deleteAppEnvElement,
  publishAppEnvElement,
  PUBLISH_MODE_GRAY,
  PUBLISH_MODE_ALL,
} from "../../../services/app";

export default {
  name: "BasicDetail",
  components: { PageLayout, DetailListItem, DetailList },
  data() {
    return {
      appId: "",
      app: null,

      envs: [],
      curEnv: "",
      envInputVisible: false,
      envInput: "",

      elements: [],
      pagination: { hasMore: true, LIMIT: LIMIT, nextSeek: "" },
      // elemDrawerVisible: false,

      CONTENT_TYPE_MAPPING: CONTENT_TYPE_MAPPING,
      PUBLISH_MODE_GRAY: PUBLISH_MODE_GRAY,
      PUBLISH_MODE_ALL: PUBLISH_MODE_ALL,
    };
  },
  computed: {
    title() {
      return this.app ? this.app.name : `应用详情${this.appId}`;
    },
    desc() {
      return this.app ? this.app.description : "加载中";
    },
  },
  methods: {
    handleFocusEnvInput() {
      this.envInputVisible = true;
      // console.log(
      //   "============ handleFocusEnvInput called",
      //   this.$refs,
      //   this.$refs.refInput
      // );
      this.$refs.refInput.focus();
    },
    handleInputConfirm() {
      // console.log("============ handleInputConfirm called", this.envInput);
      this.envInputVisible = false;
      if (!this.envInput) {
        return;
      }
      createAppEnv({ appId: this.appId, env: this.envInput }).then(() => {
        this.envInput = "";
        setTimeout(() => {
          getAppEnvs({ appId: this.appId }).then((res) => {
            let { envs } = res.data.data;
            this.envs = envs;
          });
        }, 1000);
      });
    },
    handleEnvChange({ env }) {
      if (env === this.curEnv) {
        // no need refresh env elements
        return;
      }

      this.curEnv = env;
      getAppElements({ appId: this.appId, env: this.curEnv }).then((res) => {
        const { elements, hasMore, nextSeek } = res.data.data;
        this.elements = elements;
        this.pagination = { hasMore, nextSeek, LIMIT: LIMIT };
      });
    },
    handleRefreshElements() {
      getAppElements({ appId: this.appId, env: this.curEnv }).then((res) => {
        const { elements, hasMore, nextSeek } = res.data.data;
        this.elements = elements;
        this.pagination = { hasMore, nextSeek, LIMIT: LIMIT };
      });
    },
    handleMenuClick({ key }) {
      switch (key) {
        case "newEle":
          // this.elemDrawerVisible = true;
          this.$router.push({
            path: `/application/detail/${this.appId}/new`,
            query: { env: this.curEnv },
          });
          break;
        default:
          break;
      }
    },
    handleEnvDelete(env) {
      deleteAppEnv({ appId: this.appId, env }).then(() => {
        // 如果删除的是当前环境，则切换到默认环境
        if (env === this.curEnv) {
          this.handleEnvChange({ env: "default" });
        }
      });
    },
    handlePublishAppVersion(elem, mode) {
      if (!elem) return;

      if (!elem.metadata.unpublishedVersion) {
        this.$message.info("没有可供发布的版本");
        return;
      }

      publishAppEnvElement({
        appId: this.appId,
        env: this.curEnv,
        key: elem.metadata.key,
        version: elem.metadata.unpublishedVersion,
        mode: mode,
      }).then(() => {
        this.$message.success("发布成功");
        setTimeout(() => this.handleRefreshElements(), 500);
      });
    },
    handleDeleteAppEnvElement(elemKey) {
      deleteAppEnvElement({
        appId: this.appId,
        env: this.curEnv,
        key: elemKey,
      }).then(() => {
        this.handleRefreshElements();
      });
    },
    handleClickEdit(elem) {
      this.$router.push({
        path: `/application/detail/${this.app.id}/edit`,
        query: { env: this.curEnv, key: elem.metadata.key, step: 1 },
      });
    },
    handleClickHistoryVersion(elem) {
      this.$router.push({
        path: `/application/detail/${this.app.id}/versions`,
        query: {
          env: this.curEnv,
          key: elem.metadata.key,
        },
      });
    },
  },
  created() {
    const { appId } = this.$route.params;
    if (!appId) {
      return;
    }
    this.appId = appId;

    // app detail
    getApp({ appId }).then((res) => {
      this.app = res.data.data;
    });

    // envs and env elements
    getAppEnvs({ appId }).then((res) => {
      this.envs = res.data.data.envs;
      if (this.envs.length <= 0) {
        return;
      }

      this.handleEnvChange({ env: this.envs[0] });
    });
  },
};
</script>

<style lang="less" scoped>
.title {
  color: @title-color;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.exception-page {
  padding: 4em;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: @base-bg-color;
  .img {
    padding-right: 52px;
    zoom: 1;
    img {
      max-width: 430px;
    }
  }
}
</style>
