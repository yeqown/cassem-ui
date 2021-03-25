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
        <a-input v-model:value="state.form.key" />
      </a-form-item>

      <!-- datatype -->
      <a-form-item label="Datatype">
        <a-select
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
        <!-- KV -->
        <a-input
          v-model:value="state.form.value"
          v-show="state.form.datatype in [1, 2, 3, 0]"
        />

        <!-- boolean -->
        <a-select
          v-model:value="state.form.value"
          placeholder="Choose one"
          v-show="state.form.datatype === 4"
        >
          <a-select-option :value="true">True</a-select-option>
          <a-select-option :value="false">False</a-select-option>
        </a-select>

        <!-- LIST -->
        <a-list
          v-show="state.form.datatype === 5"
          :data-source="state.form.listValue"
        >
          <template #renderItem="{ item }">
            <a-list-item
              ><span>{{ item }}</span></a-list-item
            >
          </template>

          <template #footer>
            <a-button type="dashed" style="width: 100%" @click="addValueToList">
              <PlusOutlined />
              Add item
            </a-button>
          </template>
        </a-list>

        <!-- LIST -->
        <a-table
          v-show="state.form.datatype === 6"
          :data-source="state.form.dictValue"
        >
        </a-table>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { getPairDetail, savePair } from "/@/services/pairs";
import { mappingDT, transformIntoPair } from "/@/services/mapping";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
  },

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
        listValue: [],
        dictValue: [],
      },
      isCreating: props.editingMode === "creating",
    });

    const translateDataType = (dt) => {
      return mappingDT[dt];
    };

    // datatype switch event
    const hdlDatatypeSwitch = (value, option) => {
      console.log("switched=========", value, option);
      switch (value) {
        case 4:
          state.form.value = false;
          break;
        case 5:
          // list datatype initialize "string[]"
          state.form.listValue = [];
          break;
        case 6:
          // dict datatye initialize {key, datatype, string}[]"
          state.form.dictValue = [];
          break;
        default:
          state.form.value = "";
      }
    };

    const addValueToList = () => {
      state.form.listValue.push("");
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
      state.form = { key, datatype };

      switch (datatype) {
        case 5:
          state.form.listValue = value;
          break;
        case 6:
          console.error("implement me to transform dict into arrar VO");
          // state.form.dictValue = value;
          break;
        default:
          state.form.value = value;
          break;
      }
    });

    return {
      state,
      translateDataType,
      hdlCreateOrUpdate,
      hdlDatatypeSwitch,
      addValueToList,
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
  },
};
</script>

<style lang="less" scoped>
</style>
