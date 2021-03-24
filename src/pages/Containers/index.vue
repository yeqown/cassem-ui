<template>
  <a-card>
    <a-page-header
      title="CONTAINERS"
      :sub-title="`containers of the namespace [${state.ns}]`"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-input-search
          v-model:value="state.containerKeyPattern"
          placeholder="input container key pattern"
          :loading="state.searchLoading"
          enter-button
          @search="hdlSearch"
          @pressEnter="hdlSearch"
          style="width: 200px"
        />
        <a-button type="primary">
          <template #icon><PlusCircleOutlined /></template>
        </a-button>
      </template>
    </a-page-header>

    <a-table :columns="state.columns" :data-source="state.containers">
      <template #containerKey="{ record }">
        <router-link :to="`/namespaces/${state.ns}/containers/${record.key}`">
          <a-tag color="geekblue">{{ record.key.toUpperCase() }}</a-tag>
        </router-link>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { reactive, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { pagingContainers } from "/@/services/container";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    PlusCircleOutlined,
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      containers: [],
      ns: route.params.ns,
      containerKeyPattern: "",
      searchLoading: false,
      columns: [
        {
          title: "CONTAINER-KEY",
          dataIndex: "key",
          key: "key",
          slots: {
            customRender: "containerKey",
          },
        },
        {
          title: "NAMESAPCE",
          dataIndex: "namespace",
        },
        {
          title: "CHECKSUM",
          dataIndex: "checkSum",
        },
      ],
    });

    const getContainer = async () => {
      state.searchLoading = true;
      const data = await pagingContainers(state.ns, {
        key: state.containerKeyPattern,
      });
      state.containers = data.containers;
      state.searchLoading = false;
    };

    const hdlSearch = () => {
      // console.log("clicked", state.containerKeyPattern);
      // if (state.containerKeyPattern === "") {
      //   return;
      // }
      getContainer();
    };

    onMounted(async () => {
      getContainer();
    });

    return { state, hdlSearch };
  },
};
</script>
