<template>
  <page-layout :desc="desc">
    <advance-table
      :columns="columns"
      :dataSource="versions"
      :title="`${key} 的历史版本`"
      :refresh="handleTableRefresh"
      :pagination="true"
    >
      <template slot="published" slot-scope="{ text }">
        <a-tooltip v-if="text.published">
          <template slot="title"> 已发布 </template>
          <a-badge dot color="green" />
        </a-tooltip>
        <a-tooltip v-else>
          <template slot="title"> 未发布 </template>
          <a-badge dot color="red" />
        </a-tooltip>
      </template>

      <template slot="isUsing" slot-scope="{ text }">
        <a-tooltip v-if="text.version === text.metadata.usingVersion">
          <template slot="title"> 使用中版本 </template>
          <a-badge dot color="green" />
        </a-tooltip>
        <a-tooltip v-else>
          <template slot="title"> 非当前使用版本 </template>
          <a-badge dot color="red" />
        </a-tooltip>
      </template>

      <template slot="actions" slot-scope="{ text }">
        <a-tooltip style="margin-right: 1em">
          <template slot="title"> 回滚到当前版本 </template>
          <a-icon
            type="rollback"
            :style="{ color: 'green' }"
            @click="handleRollbackVersion(text.version)"
          />
        </a-tooltip>

        <a-tooltip style="margin-right: 1em">
          <template slot="title"> 发布当前版本 </template>
          <a-dropdown>
            <a-icon type="pull-request" :style="{ color: 'green' }" />
            <a-menu slot="overlay">
              <a-menu-item
                @click="handlePublishVersion(text.version, PUBLISH_MODE_ALL)"
              >
                <a-icon type="robot" /> 全量发布</a-menu-item
              >
              <a-menu-item
                @click="handlePublishVersion(text.version, PUBLISH_MODE_ALL)"
              >
                <a-icon type="monitor" /> 灰度发布</a-menu-item
              >
            </a-menu>
          </a-dropdown>
        </a-tooltip>

        <a-popover>
          <template slot="content">
            <p>{{ text.raw }}</p>
          </template>
          <a>查看</a>
        </a-popover>
      </template>
    </advance-table>
  </page-layout>
</template>

<script>
// import DetailList from "../../../components/tool/DetailList";
import PageLayout from "../../../layouts/PageLayout";
import AdvanceTable from "../../../components/table/advance";
import { CONTENT_TYPE_MAPPING } from "../config";

// const DetailListItem = DetailList.Item;
// const LIMIT = 100;

const columns = [
  {
    title: "版本",
    dataIndex: "version",
  },
  {
    title: "是否发布",
    scopedSlots: { customRender: "published" },
  },
  {
    title: "是否当前使用",
    scopedSlots: { customRender: "isUsing" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "actions" },
  },
];

import {
  getApp,
  getAppEnvElementVersions,
  publishAppEnvElement,
  rollbackAppEnvElement,
  PUBLISH_MODE_GRAY,
  PUBLISH_MODE_ALL,
  getAppEnvElement,
} from "../../../services/app";
import { decode } from "js-base64";

export default {
  name: "Versions",
  components: { PageLayout, AdvanceTable },
  data() {
    return {
      columns: columns,
      versions: [],

      appId: "",
      app: null,
      env: "",
      elem: null,
      nextSeek: "",
      hasMore: false,

      CONTENT_TYPE_MAPPING: CONTENT_TYPE_MAPPING,
      PUBLISH_MODE_GRAY: PUBLISH_MODE_GRAY,
      PUBLISH_MODE_ALL: PUBLISH_MODE_ALL,
    };
  },
  computed: {
    desc() {
      return this.app ? "查看应用中某一个配置的历史版本" : "加载中";
    },
  },
  methods: {
    handleTableRefresh() {
      // console.log("table refresh");
      // get whole versions
      getAppEnvElementVersions({
        appId: this.appId,
        env: this.env,
        key: this.key,
      }).then((res) => {
        //   console.log(res.data);
        let { elements, hasMore, nextSeek } = res.data.data;
        this.nextSeek = nextSeek;
        this.hasMore = hasMore;
        this.versions = elements.map((item) => {
          item.raw = decode(item.raw);
          return item;
        });
      });
    },
    handleRollbackVersion(version) {
      if (!version) return;

      if (version >= this.elem.metadata.usingVersion) {
        this.$message.warn("不能回滚到当前使用版本及以后的版本");
        return;
      }

      rollbackAppEnvElement({
        appId: this.appId,
        env: this.env,
        key: this.key,
        version: version,
      }).then(() => {
        this.$message.success("回滚成功");
        setTimeout(() => {
          this.handleTableRefresh();
        }, 500);
      });
    },

    handlePublishVersion(version, mode = PUBLISH_MODE_ALL) {
      if (!version) return;

      if (version <= this.elem.metadata.usingVersion) {
        this.$message.warn("不可发布当前使用版本及以前的版本");
        return;
      }

      publishAppEnvElement({
        appId: this.appId,
        env: this.env,
        key: this.key,
        version: version,
        mode: mode,
      }).then(() => {
        this.$message.success("发布成功");
        setTimeout(() => this.handleTableRefresh(), 500);
      });
    },
  },
  created() {
    const { appId } = this.$route.params;
    const { key, env } = this.$route.query;
    if (!appId || !env || !key) {
      return;
    }
    this.env = env;
    this.appId = appId;
    this.key = key;

    // app detail
    getApp({ appId }).then((res) => {
      this.app = res.data.data;
    });

    getAppEnvElement({ appId, env, key }).then((res) => {
      this.elem = res.data.data;
    });

    this.handleTableRefresh();
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
