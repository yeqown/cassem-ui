<template>
  <a-card>
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
  </a-card>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getPairList } from "/@/services/namespace";
import { mappingDT } from "/@/services/mapping";
export default {
  setup() {
    const route = useRoute();
    const state = reactive({
      ns: route.params.ns,
      pairs: [],
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
      const data = await getPairList(state.ns, { limit: 10 });
      state.pairs = data.pairs;
      console.log(state.pairs);
    };

    const translateDatatype = (dt) => {
      return mappingDT[dt];
    };

    onMounted(async () => {
      getPair();
    });

    return { state, translateDatatype };
  },
};
</script>
