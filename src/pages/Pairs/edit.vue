<template>
  <a-page-header
    :title="state.isCreating ? 'New' : 'Edit'"
    :sub-title="`create or edit a pair under the namespace [${state.ns}]`"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button type="primary" @click="hdlCreateOrUpdate"> SAVE </a-button>
    </template>
  </a-page-header>

  <div style="padding: 0 24px">
    <a-form :model="state.form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <!-- key -->
      <a-form-item label="Key">
        <a-input v-model:value="state.form.key" :disabled="!state.isCreating" />
      </a-form-item>

      <!-- datatype -->
      <a-form-item label="Datatype">
        <a-select
          :disabled="!state.isCreating"
          v-model:value="state.form.datatype"
          placeholder="please select your zone"
          @change="hdlDatatypeSwitch"
        >
          <a-select-option :value="0">INVALID</a-select-option>
          <a-select-option :value="1">Integer</a-select-option>
          <a-select-option :value="2">String</a-select-option>
          <a-select-option :value="3">Float</a-select-option>
          <a-select-option :value="4">Boolean</a-select-option>
          <a-select-option :value="5">List</a-select-option>
          <a-select-option :value="6">Dictionary</a-select-option>
        </a-select>
      </a-form-item>

      <!-- value container node, should be changed while datatype changed -->
      <a-form-item label="Value" v-show="state.form.datatype != 0">
        <!-- <codemirror :code="jsonstr" @change="hdlCodemirrorChange" /> -->
        <codeeditor v-model="jsonstr" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPairDetail, savePair } from "/@/services/pairs";
import {
  mappingDT,
  transformIntoPair,
  getDefaultValueOfDatatype,
} from "/@/services/mapping";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
// import codemirror from "../../components/codemirror.vue";
import codeeditor from "../../components/codeeditor.vue";

export default {
  components: {
    PlusOutlined,
    // codemirror,
    codeeditor,
  },

  props: {
    editingMode: "",
  },

  setup(props) {
    // const formRef = ref();
    const route = useRoute();
    const router = useRouter();
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

    // datatype switch event
    const hdlDatatypeSwitch = (value, option) => {
      console.log("switched=========", value, option);
      state.form.value = {
        value: getDefaultValueOfDatatype(value),
      };
    };

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
        value: transformIntoPair(jsonstr.value),
      };
      let data = await savePair(state.ns, form);
      if (data.errcode === 0) {
        message.success(`'${state.form.key}' saved`);
        router.go(-1);
      }
    };

    const jsonstr = ref("");
    // watch state.form.value
    watch(
      () => {
        return state.form.value;
      },

      (newValue, preValue) => {
        // console.log(
        //   "watching value ==================, state.form changed",
        //   newValue
        // );
        jsonstr.value = JSON.stringify(newValue, null, "\t");
        console.log("jsonstr chahged: ", jsonstr.value);
      }
    );

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
      state.form = { key, datatype };
      state.form.value = { value: value };
    });

    const hdlCodemirrorChange = () => {
      console.log("hdlCodemirrorChange called");
    };

    return {
      state,
      jsonstr,

      translateDataType,
      hdlCreateOrUpdate,
      hdlDatatypeSwitch,
      // watchTabPress,
      hdlCodemirrorChange,

      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };
  },
};
</script>

<style lang="less" scoped>
</style>
