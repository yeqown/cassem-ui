<template>
  <a-page-header
    title="Edit"
    :sub-title="`create or edit a pair under the namespace [${state.ns}]`"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button type="primary" @click="hdlCreateOrUpdate"> SAVE </a-button>
    </template>
  </a-page-header>

  <div style="padding: 0 24px">
    <a-form :model="state.form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="Key">
        <a-input v-model:value="state.form.key" />
      </a-form-item>
      <a-form-item label="Datatype">
        <a-select
          v-model:value="state.form.datatype"
          placeholder="please select your zone"
        >
          <a-select-option :value="0">Invalid Datatype</a-select-option>
          <a-select-option :value="1">Integer</a-select-option>
          <a-select-option :value="2">String</a-select-option>
          <a-select-option :value="3">Float</a-select-option>
          <a-select-option :value="4">Boolean</a-select-option>
          <a-select-option :value="5">List</a-select-option>
          <a-select-option :value="6">Dictionary</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Value">
        <a-input v-model:value="state.form.value" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getPairDetail, savePair } from "/@/services/pairs";
import { mappingDT } from "/@/services/mapping";
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
      form: {
        key: route.params.pairKey,
        datatype: 0,
        value: null,
      },
      isCreating: props.editingMode === "creating",
    });

    const translateDataType = (dt) => {
      return mappingDT[dt];
    };

    // const testData = () => {
    //   state.fields.push(
    //     {
    //       fieldType: 1,
    //       key: "kv",
    //       pairs: [{ pairKey: "i" }],
    //     },
    //     {
    //       fieldType: 2,
    //       key: "list-demo",
    //       pairs: [{ pairKey: "i" }, { pairKey: "i" }, { pairKey: "i" }],
    //     },
    //     {
    //       fieldType: 3,
    //       key: "dict-demo",
    //       pairs: [
    //         { key: "int", pairKey: "i" },
    //         { key: "int2", pairKey: "i" },
    //       ],
    //     }
    //   );
    //   setTimeout(() => {}, 2);
    // };
    const hdlCreateOrUpdate = async () => {
      // create or update pair
      if (!state.form.key || state.form.key === "new") {
        message.error("Invalid pair key!");
        return;
      }
      // TODO(@yeqown): transform value from VO into API
      let form = {
        key: state.form.key,
        datatype: state.form.datatype,
        value: transformIntoPair(state.form),
      };
      await savePair(state.ns, form);
    };

    onMounted(async () => {
      // console.log("==============", route.params, route.fullPath, route.props);
      const { ns, pairKey } = route.params;
      if (state.isCreating) {
        state.form.key = "";
        // in creating mode, DO NOT request from remote API server.
        return;
      }

      const data = await getPairDetail(ns, pairKey);
      let { key, datatype, value } = data;
      state.form = { key, datatype, value };
    });

    return {
      state,
      translateDataType,
      hdlCreateOrUpdate,
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
  },
};
</script>

<style lang="less" scoped>
</style>
