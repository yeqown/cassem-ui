<template>
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
      <a-button type="primary" @click="hdlCreateContainer">
        <template #icon><PlusCircleOutlined /></template>
      </a-button>
    </template>
  </a-page-header>

  <div style="padding: 0 24px">
    <a-table :columns="columns" :data-source="state.containers">
      <!-- container custome render -->
      <template #containerKey="{ record }">
        <router-link :to="`/namespaces/${state.ns}/containers/${record.key}`">
          <a-tag color="geekblue">{{ record.key.toUpperCase() }}</a-tag>
        </router-link>
      </template>
      <!-- custome ops render -->
      <template #ops>
        <a-button
          type="danger"
          shape="circle"
          @click="hdlDelContainer"
          size="small"
          ><DeleteOutlined color="red" />
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pagingContainers, delContainer } from "/@/services/container";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    PlusCircleOutlined,
    DeleteOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      containers: [],
      ns: route.params.ns,
      containerKeyPattern: "",
      searchLoading: false,
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

    const hdlDelContainer = (key) => {
      delContainer(state.ns, key);
    };

    const hdlCreateContainer = () => {
      // console.log("called", router);
      router.push(`/namespaces/${state.ns}/containers/new?m=creating`);
    };

    onMounted(async () => {
      getContainer();
    });

    const columns = [
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
      {
        title: "OPS",
        slots: {
          customRender: "ops",
        },
      },
    ];

    return { state, hdlSearch, columns, hdlDelContainer, hdlCreateContainer };
  },
};
</script>
