<template>
  <div>
    <!-- <a-card :bordered="false">
      <div style="display: flex; flex-wrap: wrap">
          <head-info title="我的待办" content="8个任务" :bordered="true"/>
          <head-info title="本周任务平均处理时间" content="32分钟" :bordered="true"/>
          <head-info title="本周完成任务数" content="24个"/>
      </div>
    </a-card> -->
    <a-card :bordered="false">
      <div slot="extra">
        <a-input-search style="margin-right: 8px; width: 272px" />
        <span style="float: right">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </span>
      </div>
      <!-- <a-button type="dashed" style="width: 100%" icon="plus">添加</a-button> -->
      <standard-table
        :columns="columns"
        :dataSource="instances"
        :loading="loading"
        :rowKey="'clientId' + 'clientIp'"
      >
        <template slot="watching" slot-scope="{ text }">
          <!-- {{ text }} -->
          <a-list>
            <a-list-item :key="index" v-for="(ins, index) in text">
              <a-list-item-meta :description="ins.app + ' => ' + ins.env">
              </a-list-item-meta>
              <a-tag
                v-for="(elemKey, index) in ins.watchKeys"
                :key="index"
                disabled
              >
                {{ elemKey }}
              </a-tag>
            </a-list-item>
          </a-list>
        </template>
      </standard-table>
    </a-card>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getInstances } from "../../services/cluster";
import { humandate } from "../../utils/humandate";

const columns = [
  {
    title: "客户端标识",
    dataIndex: "clientId",
  },
  {
    title: "客户端IP",
    dataIndex: "clientIp",
  },
  {
    title: "代理服务",
    dataIndex: "agentId",
  },
  {
    title: "最近刷新时间",
    dataIndex: "lastRenewTimestamp",
    customRender: (text) =>
      text ? humandate.relativeTime(text - new Date().getTime() / 1000) : "?",
  },
  {
    title: "关注的配置",
    dataIndex: "watching",
    scopedSlots: { customRender: "watching" },
  },
];

export default {
  name: "ClientInstanceList",
  components: {
    // HeadInfo
    StandardTable,
  },
  computed: {
    desc() {
      return "展示所有的客户端实例，以及他们正在关注的配置";
    },
  },
  data() {
    return {
      instances: [],
      loading: false,
      hasMore: false,
      nextSeek: "",
      search: "",
      columns: columns,
    };
  },
  created() {
    getInstances({ limit: 10, seek: this.search || this.nextSeek }).then(
      (res) => {
        let { instances, hasMore, nextSeek } = res.data.data;
        this.instances = instances;
        this.hasMore = hasMore;
        this.nextSeek = nextSeek;

        console.log("instances", instances);
      }
    );
  },
};
</script>

<style lang="less" scoped>
.list-content-item {
  color: @text-color-second;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin: 4px 0 0;
    line-height: 22px;
  }
}
</style>
