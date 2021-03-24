<template>
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

  <div style="padding: 0 24px">
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
                pair.key && pair.key != '-'
                  ? { maxlength: 50, autoSize: { maxRows: 1, minRows: 1 } }
                  : false
              "
            />
          </template>
        </a-table>
      </template>
    </a-table>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getContainerDetail, saveContainer } from "/@/services/container";
import {
  mappingFT,
  transformField,
  transformIntoField,
} from "/@/services/mapping";
import { message } from "ant-design-vue";

export default {
  props: {
    editingMode: "",
  },

  setup(props) {
    // const formRef = ref();
    const route = useRoute();
    const state = reactive({
      ns: route.params.ns,
      key: route.params.containerKey,
      fields: [],
      isCreating: props.editingMode === "creating",
    });

    const translateFieldType = (ft) => {
      return mappingFT[ft];
    };

    const testData = () => {
      state.fields.push(
        {
          fieldType: 1,
          key: "kv",
          pairs: [{ pairKey: "i" }],
        },
        {
          fieldType: 2,
          key: "list-demo",
          pairs: [{ pairKey: "i" }, { pairKey: "i" }, { pairKey: "i" }],
        },
        {
          fieldType: 3,
          key: "dict-demo",
          pairs: [
            { key: "int", pairKey: "i" },
            { key: "int2", pairKey: "i" },
          ],
        }
      );
      setTimeout(() => {}, 2);
    };
    const hdlCreateOrUpdate = async () => {
      testData();

      // create or update container
      // console.log(state.fields);
      if (!state.key || state.key === "new") {
        message.error("Invalid container key!");
        return;
      }

      let fields = [];
      state.fields.forEach((item, idx) => {
        fields.push(transformIntoField(item));
      });

      await saveContainer(state.ns, state.key, fields);
    };

    onMounted(async () => {
      // console.log("==============", route.params, route.fullPath, route.props);
      const { ns, containerKey } = route.params;
      if (state.isCreating) {
        state.key = "";
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
