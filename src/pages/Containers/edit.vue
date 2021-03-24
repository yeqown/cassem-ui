<template>
  <a-card>
    <a-page-header
      title="New"
      :sub-title="`create a container under the namespace [${state.ns}]`"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-input
          v-model:value="state.key"
          :disabled="!state.isCreating"
          style="width: 200px"
        />
        <a-button type="primary" @click="hdlCreateOrUpdate"> SAVE </a-button>
      </template>
    </a-page-header>

    <!-- fields table -->
    <a-table :columns="columns" :data-source="state.fields" bordered>
      <template #fieldkey="{ record: field }">
        <a-typography-paragraph v-model:content="field.key" editable />
      </template>

      <template #fieldtype="{ record: field }">
        <a-tag color="geekblue">{{
          translateFieldType(field.fieldType).toUpperCase()
        }}</a-tag>
      </template>

      <template #expandedRowRender="{ record: field }">
        <!-- field pairs table -->
        <a-table
          :columns="fieldPairsColumns"
          :data-source="field.pairs"
          :pagination="false"
          :showHeader="false"
        >
          <template #alias="{ record: pair }">
            <a-typography-paragraph
              v-model:content="pair.key"
              :editable="
                pair.key != '-'
                  ? { maxlength: 50, autoSize: { maxRows: 1, minRows: 1 } }
                  : false
              "
            />
          </template>
        </a-table>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getContainerDetail } from "/@/services/container";
import { mappingFT, transformField } from "/@/services/mapping";
export default {
  props: {
    editingMode: "",
  },

  setup(props) {
    // const formRef = ref();
    const route = useRoute();
    const state = reactive({
      ns: "",
      key: "",
      fields: [],
      isCreating: props.editingMode === "creating",
    });

    const translateFieldType = (ft) => {
      return mappingFT[ft];
    };

    const hdlCreateOrUpdate = () => {
      // create or update container
      console.error("implement me");
    };

    onMounted(async () => {
      // console.log("==============", route.params, route.fullPath, route.props);
      const { ns, containerKey } = route.params;
      state.ns = ns;
      state.key = containerKey;
      if (state.isCreating) {
        // in creating mode, DO NOT request from remote API server.
        return;
      }
      const data = await getContainerDetail(ns, containerKey);
      data.fields.forEach((field, idx) => {
        state.fields.push(transformField(field));
      });
    });

    const columns = [
      {
        title: "FIELD KEY",
        dataIndex: "key",
        slots: {
          customRender: "fieldkey",
        },
      },
      {
        title: "FIELD TYPE",
        dataIndex: "fieldType",
        slots: {
          customRender: "fieldtype",
        },
      },
    ];

    const fieldPairsColumns = [
      {
        title: "ALIAS",
        dataIndex: "key",
        slots: {
          customRender: "alias",
        },
      },
      {
        title: "PAIR KEY",
        dataIndex: "pairKey",
        slots: {
          customRender: "pairKey",
        },
      },
    ];

    return {
      state,
      labelCol: { span: 3 },
      wrapperCol: { span: 4 },

      translateFieldType,
      hdlCreateOrUpdate,

      columns,
      fieldPairsColumns,
    };
  },
};
</script>

<style lang="less" scoped>
:deep(.config-key) {
  // background: white;
  display: flex;
  // padding: 10px;
  .item {
    flex: 1;
  }
}
</style>
