<template>
  <a-card class="result-success" :bordered="false">
    <result :is-success="true" :description="description" :title="title">
      <template slot="action">
        <a-button class="action" type="primary" @click="handleClickBackAppList"
          >返回列表</a-button
        >
        <a-button class="action">查看项目</a-button>
      </template>
      <div>
        <div class="project-name">APP信息</div>
        <detail-list size="small" style="max-width: 800px; margin-bottom: 8px">
          <detail-list-item term="唯一标识">{{ app.appId }}</detail-list-item>
          <detail-list-item term="应用名">{{ app.name }}</detail-list-item>
          <detail-list-item term="创建人">{{ app.creator }}</detail-list-item>
          <detail-list-item term="应用描述">{{
            app.description
          }}</detail-list-item>
        </detail-list>
        <a-steps :current="1" progressDot>
          <a-step title="创建应用">
            <a-step-item-group slot="description">
              <a-step-item :title="app.creator" />
              <a-step-item :title="app.createdAt" />
            </a-step-item-group>
          </a-step>
          <!-- <a-step title="部门初审">
            <a-step-item-group slot="description">
              <a-step-item
                title="周毛毛"
                icon="dingding-o"
                :iconStyle="{ color: '#00A0E9' }"
              />
              <a-step-item title="催一下" :titleStyle="{ color: '#00A0E9' }" />
            </a-step-item-group>
          </a-step> -->
          <a-step title="上级审核"></a-step>
          <a-step title="完成"></a-step>
        </a-steps>
      </div>
    </result>
  </a-card>
</template>

<script>
import Result from "../../../components/result/Result";
import DetailList from "../../../components/tool/DetailList";
import AStepItem from "../../../components/tool/AStepItem";

import { getApp } from "../../../services/app";
import { humandate } from "../../../utils/humandate";

const AStepItemGroup = AStepItem.Group;
const DetailListItem = DetailList.Item;
export default {
  name: "Success",
  components: { AStepItem, AStepItemGroup, DetailListItem, DetailList, Result },
  data() {
    return {
      title: "创建成功",
      description: `资源创建成功，请核对以下信息：`,
      app: {
        name: "APP信息",
        appId: "APP-00001",
        description: "APP-00001",
        creator: "张三",
        createdAt: "2018-08-08",
      },
    };
  },
  methods: {
    // print() {
    //   window.print();
    // },
    handleClickBackAppList() {
      this.$router.push("/application/list");
    },
  },
  created() {
    // console.log(this.$route.query);
    const { appId } = this.$route.query;
    if (!appId) {
      this.$router.push("/dashboard");
      return;
    }

    getApp({ appId }).then((res) => {
      this.app = res.data.data;

      this.app.createdAt = humandate.prettyPrint(
        new Date(this.app.createdAt * 1000)
      );
    });
  },
};
</script>

<style scoped lang="less">
.result-success {
  .action:not(:first-child) {
    margin-left: 8px;
  }
  .project-name {
    font-size: 16px;
    color: @title-color;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>
