<template>
  <a-form :model="state" :layout="layout">
    <a-form-item label="Key">
      <a-input v-model:value="state.key" />
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="state.fields" bordered>
    <template #expandedRowRender="{ record }">
      <p style="margin: 0" class="config-key">

        <div class="item" v-if="record.fieldType === 3 ">
          <div v-for="(item,index) in record.value">
            key:{{index}}
          </div>
        </div>
        <div class="item" v-if="record.fieldType === 3">
          <div v-for="(item,index) in record.value">
            pair key:{{item.key}}
          </div>
        </div>
        <div class="item" v-else-if="record.fieldType === 2">
          <div v-for="(item,index) in record.value">
            pair key:{{item.key}}
          </div>
        </div>
        <div class="item" v-else>
            pair key:{{record.value.key}}
        </div>
      </p>
    </template>
  </a-table>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const formRef = ref();
    const route = useRoute();
    const state = reactive({
      list: [],
      key: "",
      fields: [],
    });
    const columns = [
      {
        title: "key",
        dataIndex: "key",
      },
      {
        title: "fieldsType",
        dataIndex: "fieldType",
      },
    ];

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

    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
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
    onMounted(async () => {
      const { ns, pairKey } = route.params;
      const data = await getCtConfig(ns, pairKey);
      state.key = data.key;
      state.fields = data.fields;
    });
    return {
      state,
      rules,
      layout,
      handleFinish,
      handleFinishFailed,
      resetForm,
      formRef,
      columns,
    };
  },
};
</script>
<style lang="less" scoped>
:deep(.config-key) {
  background: white;
  display: flex;
  padding: 10px;
  .item {
    flex: 1;
  }
}
</style>
