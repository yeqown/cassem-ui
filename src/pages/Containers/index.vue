<template>
  <a-card>
    <a-table :columns="columns" :data-source="containers">
      <template #containerKey="{ record }">
          <router-link :to="`/namespaces/${ns}/containers/${record.key}`">
            <a-tag color='geekblue'>{{ record.key.toUpperCase() }}</a-tag>
          </router-link>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { reactive, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { getCtList } from "/@/services/container";
export default {
  setup() {
    const route = useRoute();
    const state = reactive({
      containers: [],
      ns: route.params.ns,
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
          title: "CHECKSUM",
          dataIndex: "checkSum",
        },
      ],
    });

    const getContainer = async () => {
      const data = await getCtList(state.ns);
      state.containers = data.containers;
      console.log(data)
    };
    
    onMounted(async () => {
      getContainer();
    });
    return state;
  },
};
</script>
