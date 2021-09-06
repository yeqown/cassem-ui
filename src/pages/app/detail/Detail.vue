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
          color="green"
          type="primary"
        >
          {{ env }}
        </a-tag>
      </template>

      <a-input
        v-if="envInputVisible"
        ref="refInput"
        type="text"
        size="small"
        :style="{ width: '78px', 'margin-right': '10px' }"
        :value="envInput"
        @blur="handleInputConfirm"
        @keyup.enter="handleInputConfirm"
      />
      <a-tag
        v-else
        style="background: #fff; borderstyle: dashed"
        size="middle"
        @click="handleNewEnvClick"
      >
        <a-icon type="plus" /> 新增
      </a-tag>

      <a-dropdown>
        <a @click="(e) => e.preventDefault()">
          <a-icon type="ordered-list" />
        </a>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="newEle">
            <a-icon type="plus" />新增配置
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <div slot="headerContent" v-if="app">
      <span>{{ app }}</span>
    </div>

    <div v-if="elements && elements.length">
      <a-card
        :bordered="false"
        v-for="(elem, index) in elements"
        :key="index"
        :title="elem.metadata.key || '获取中'"
        style="margin-bottom: 20px"
      >
        <div slot="extra">
          <a-tag v-if="elem.published" color="green" type="primary"
            >已发布</a-tag
          >
          <a>所有版本</a>
        </div>
        <detail-list>
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
        <span>编辑/删除/发布/回滚</span>
        <template slot="actions" class="ant-card-actions">
          <a-tooltip>
            <template slot="title"> 编辑 </template>
            <a-icon key="edit" type="edit" />
          </a-tooltip>
          <a-tooltip>
            <template slot="title"> 发布 </template>
            <a-icon key="pull-request" type="pull-request" /> </a-tooltip
          ><a-tooltip>
            <template slot="title"> 回滚 </template>
            <a-icon key="rollback" type="rollback" /> </a-tooltip
          ><a-tooltip>
            <template slot="title"> 删除 </template>
            <a-icon key="delete" type="delete" color="red" />
          </a-tooltip>
        </template>
      </a-card>
      <a-button
        size="large"
        type="dashed"
        style="width: 100%; height: 4em"
        @click="
          () => {
            this.$router.push({
              path: `/application/detail/${appId}/new-element`,
              query: { env: curEnv },
            });
          }
        "
      >
        <a-icon type="plus" size="4em" />
      </a-button>
    </div>
    <div v-else class="exception-page">
      <img
        class="img"
        src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg"
      />
      <span>没啥可加载，</span>
      <a
        @click="
          () => {
            this.$router.push({
              path: `/application/detail/${appId}/new-element`,
              query: { env: curEnv },
            });
          }
        "
        >去新增吧</a
      >
    </div>

    <!-- <template>
      <a-drawer
        title="新增配置"
        placement="right"
        :width="720"
        :closable="false"
        :visible="elemDrawerVisible"
        @close="onClose"
      >
        <a-form>
          <a-form-item label="配置名称">
            <a-input></a-input>
          </a-form-item>
          <a-form-item label="配置描述">
            <a-input></a-input>
          </a-form-item>
        </a-form>
      </a-drawer>
    </template> -->
  </page-layout>
</template>

<script>
import DetailList from "../../../components/tool/DetailList";
import PageLayout from "../../../layouts/PageLayout";
import { CONTENT_TYPE_MAPPING } from "../config";

const DetailListItem = DetailList.Item;
const limit = 10;

import {
  createAppEnv,
  getApp,
  getAppElements,
  getAppEnvs,
  deleteAppEnv,
} from "../../../services/app";

export default {
  name: "BasicDetail",
  components: { PageLayout, DetailListItem, DetailList },
  data() {
    return {
      appId: "",
      app: null,

      envs: [],
      curEnv: "default",
      envInputVisible: false,
      envInput: "",

      elements: [],
      pagination: { hasMore: true, limit: limit, nextSeek: "" },
      // elemDrawerVisible: false,

      CONTENT_TYPE_MAPPING: CONTENT_TYPE_MAPPING,
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
    handleNewEnvClick() {
      this.envInputVisible = true;
      const input = this.$refs.refInput;
      console.log(this.$refs, input);
      input.focus();
    },
    handleInputConfirm() {
      console.log("============ handleInputConfirm called", this.envInput);
      this.envInputVisible = false;
      if (!this.envInput) {
        return;
      }
      createAppEnv({ appId: this.appId, env: this.envInput }).then(() => {});
    },
    handleEnvChange({ env }) {
      this.curEnv = env;
      getAppElements({ appId: this.appId, env: env }).then((res) => {
        const { elements, hasMore, nextSeek } = res.data.data;
        this.elements = elements;
        this.pagination = { hasMore, nextSeek, limit: limit };
      });
    },
    handleRefreshElements() {
      getAppElements({ appId: this.appId, env: this.curEnv }).then((res) => {
        const { elements, hasMore, nextSeek } = res.data.data;
        this.elements = elements;
        this.pagination = { hasMore, nextSeek, limit: limit };
      });
    },
    handleMenuClick({ key }) {
      switch (key) {
        case "newEle":
          // this.elemDrawerVisible = true;
          this.$router.push({
            path: `/application/detail/${this.appId}/new-element`,
            query: { env: this.curEnv },
          });
          break;
        default:
          break;
      }
    },
    handleEnvDelete(env) {
      //
      deleteAppEnv({ appId: this.appId, env }).then(() => {
        //
      });
    },
    onClose() {
      this.envDrawerVisible = false;
      this.elemDrawerVisible = false;
    },
  },
  created() {
    const { appId } = this.$route.params;
    if (!appId) {
      return;
    }
    this.appId = appId;
    getApp({ appId }).then((res) => {
      this.app = res.data.data;
    });

    getAppEnvs({ appId }).then((res) => {
      this.envs = res.data.data.envs;
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
