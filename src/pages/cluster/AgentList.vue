<template>
  <a-card>
    <div slot="extra">
      <a-input-search style="margin-right: 8px; width: 272px" />
      <span style="float: right">
        <a-button type="primary">查询</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
      </span>
    </div>
    <div>
      <standard-table
        :columns="columns"
        :dataSource="agents"
        :loading="loading"
      >
        <div slot="annotations" slot-scope="{ text }">
          <ul>
            <li v-for="(v, k) in text" :key="k">
              <span style="font-weight: 500; margin-right: 1em"
                >{{ k.toUpperCase() }}:</span
              >
              <span>{{ v }} </span>
            </li>
          </ul>
        </div>
        <!-- <div slot="action" slot-scope="{ text, record }">
          <a style="margin-right: 8px"> <a-icon type="plus" />新增 </a>
          <a style="margin-right: 8px"> <a-icon type="edit" />编辑 </a>
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />删除1
          </a>
          <router-link :to="`/list/query/detail/${record.key}`"
            >详情</router-link
          >
        </div> -->
        <template slot="status" slot-scope="{ status }">
          <a-tooltip>
            <template slot="title">{{ status || "未知" }}</template>
            <a-icon
              type="check-circle"
              v-if="status && status === 'active'"
              :style="{ color: 'green' }"
            />
            <a-icon
              type="stop"
              v-if="status && status === 'offline'"
              :style="{ color: 'gray' }"
            />
            <a-icon
              type="question-circle"
              v-if="!status || status === 'unknown'"
              :style="{ color: 'orange' }"
            />
          </a-tooltip>
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import { getAgents } from "../../services/cluster";
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "服务标识",
    dataIndex: "agentId",
  },
  {
    title: "地址(Address)",
    dataIndex: "addr",
    // scopedSlots: { customRender: "addr" },
  },
  {
    title: "状态(Status)",
    dataIndex: "status",
    // customRender: (ok) => {
    //   return ok ? "active" : "offline";
    // },
    scopedSlots: { customRender: "status" },
  },
  {
    title: "注解(Annotations)",
    dataIndex: "annotations",
    scopedSlots: { customRender: "annotations" },
  },
  // {
  //   title: "服务调用次数",
  //   dataIndex: "callNo",
  //   sorter: true,
  //   needTotal: true,
  //   customRender: (text) => text + " 次",
  // },
  // {
  //   dataIndex: "status",
  //   needTotal: true,
  //   slots: { title: "statusTitle" },
  // },
  // {
  //   title: "操作",
  //   scopedSlots: { customRender: "action" },
  // },
];

export default {
  name: "AgentList",
  components: { StandardTable },
  computed: {
    desc() {
      return "客户端代理服务列表清单，用于监控服务的运行状况，查看运行参数。";
    },
  },
  data() {
    return {
      advanced: true,
      columns: columns,
      agents: [],
      loading: false,
    };
  },
  authorize: {
    deleteRecord: "delete",
  },
  created() {
    getAgents().then((res) => {
      console.log(res.data.data);
      this.agents = res.data.data;
    });
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // onClear() {
    //   this.$message.info("您清空了勾选的所有行");
    // },
    onStatusTitleClick() {
      this.$message.info("你点击了状态栏表头");
    },
    // onChange() {
    //   this.$message.info("表格状态改变了");
    // },
    // onSelectChange() {
    //   this.$message.info("选中行改变了");
    // },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
