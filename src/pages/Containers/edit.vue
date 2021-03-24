<template>
  <a-form :model="state" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="CONTAINER KEY">
      <a-input v-model:value="state.key" :disabled="true" />
    </a-form-item>

    <a-form-item label="OPERATIONS">
      <a-button type="primary">UPDATE</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="state.fields" bordered>
    <template #fieldkey="{ record: field }">
      <a-typography-paragraph v-model:content="field.key" editable />
    </template>

    <template #fieldtype="{ record: field }">
      <a-tag color="geekblue">{{
        translateFieldType(field.fieldType).toUpperCase()
      }}</a-tag>
    </template>

    <!-- field pairs -->
    <template #expandedRowRender="{ record: field }">
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
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getCtConfig } from "/@/services/container";
import { mappingFT, transformField } from "/@/services/mapping";
export default {
  setup() {
    const formRef = ref();
    const route = useRoute();
    const state = reactive({
      list: [],
      key: "",
      fields: [],
    });

    let validatePass = async (rule, value) => {
      if (value === "") {
        return Promise.reject("Please input the password");
      } else {
        if (formState.checkPass !== "") {
          formRef.value.validateField("checkPass");
        }
        return Promise.resolve();
      }
    };

    const rules = {
      pass: [
        {
          validator: validatePass,
          trigger: "change",
        },
      ],
    };

    const handleFinish = (values) => {
      console.log(values, formState);
    };

    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const translateFieldType = (ft) => {
      return mappingFT[ft];
    };

    onMounted(async () => {
      const { ns, containerKey } = route.params;
      const data = await getCtConfig(ns, containerKey);
      state.key = data.key;
      // state.fields = data.fields;
      data.fields.forEach((field, idx) => {
        state.fields.push(transformField(field));
      });

      console.log(state.fields);
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
      labelCol: { span: 3 },
      wrapperCol: { span: 4 },
      state,
      rules,
      // layout,
      handleFinish,
      handleFinishFailed,
      resetForm,
      formRef,
      translateFieldType,

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
