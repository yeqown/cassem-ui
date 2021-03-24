<template>
  <a-page-header
    title="PAIRS"
    :sub-title="`pairs of the namespace [${state.ns}]`"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-input-search
        v-model:value="state.pairKeyPattern"
        placeholder="input pair key pattern"
        :loading="state.searchLoading"
        enter-button
        @search="hdlSearch"
        @pressEnter="hdlSearch"
        style="width: 200px"
      />
      <a-button type="primary" @click="hdlCreateClick">
        <template #icon><PlusCircleOutlined /></template>
      </a-button>
    </template>
  </a-page-header>

  <div style="padding: 0 24px">
    <a-table :columns="state.columns" :data-source="state.pairs">
      <template #pairKey="{ record }">
        "
        <router-link :to="`/namespaces/${state.ns}/pairs/${record.key}`">
          {{ record.key.toUpperCase() }}
          <!-- <a-tag :color="record.datatype <= 3 ? 'geekblue' : 'green'">{{
          }}</a-tag> -->
        </router-link>
        "
      </template>
      <template #datatype="{ record }">
        <a-tag :color="record.datatype <= 3 ? 'geekblue' : 'green'">{{
          translateDatatype(record.datatype).toUpperCase()
        }}</a-tag>
        <!-- <span>{{ record }}</span> -->
      </template>
      <template #value="{ record }">
        <span>{{ record.value }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pagingPairs } from "/@/services/pairs";
import { mappingDT } from "/@/services/mapping";
import { PlusCircleOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    PlusCircleOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      ns: route.params.ns,
      pairs: [],
      pairKeyPattern: "",
      searchLoading: false,
      columns: [
        {
          title: "KEY",
          dataIndex: "key",
          slots: {
            customRender: "pairKey",
          },
        },
        {
          title: "NAMESPACE",
          dataIndex: "namespace",
        },
        {
          title: "DATATYPE",
          dataIndex: "datatype",
          slots: {
            customRender: "datatype",
          },
        },
        {
          title: "VALUE",
          dataIndex: "value",
          slots: {
            customRender: "value",
          },
        },
      ],
    });

    const getPair = async () => {
      const data = await pagingPairs(state.ns, {
        limit: 10,
        key: state.pairKeyPattern,
      });
      state.pairs = data.pairs;
      // console.log(state.pairs);
    };

    const translateDatatype = (dt) => {
      return mappingDT[dt];
    };

    const hdlSearch = () => {
      // console.log("clicked", state.containerKeyPattern);
      // if (state.containerKeyPattern === "") {
      //   return;
      // }
      getPair();
    };

    const hdlCreateClick = () => {
      router.push(`/namespaces/${state.ns}/pairs/new?m=creating`);
    };

    onMounted(async () => {
      getPair();
    });

    return { state, translateDatatype, hdlSearch, hdlCreateClick };
  },
};
</script>
