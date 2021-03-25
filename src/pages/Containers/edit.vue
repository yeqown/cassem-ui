<template>
  <a-page-header
    :title="state.isCreating ? 'New' : 'Edit'"
    :sub-title="`create or update a container under the namespace [${state.ns}]`"
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

    <!-- page header external -->
    <div class="content">
      <div class="main">
        <a-descriptions size="middle" :column="3">
          <a-descriptions-item label="Creator">Lili Qu</a-descriptions-item>
          <a-descriptions-item label="CreatedAt"
            >2017-01-10</a-descriptions-item
          >
          <a-descriptions-item label="UpdatedAt"
            >2017-01-10</a-descriptions-item
          >
          <a-descriptions-item label="Checksum">{{
            state.checksum
          }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="extra">
        <div
          :style="{
            display: 'flex',
            width: 'max-content',
            justifyContent: 'flex-end',
          }"
        >
          <a-button type="dashed" @click="hdlAddFieldTrigger"
            ><PlusOutlined />Add Field</a-button
          >
        </div>
      </div>
    </div>
  </a-page-header>

  <!-- modal to add field to container -->
  <a-modal
    v-model:visible="state.visible"
    :title="state.isAddingField ? 'New Field' : 'Edit Field'"
    @ok="
      () => {
        state.visible = false;
        state.isAddingField = false;
        hdlAddContainerField();
        resetNewFieldForm();
      }
    "
    @cancel="
      () => {
        state.isAddingField = false;
        resetNewFieldForm();
      }
    "
  >
    <a-form
      :model="state.newFieldForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- fieldKey -->
      <a-form-item label="Field Key" required>
        <a-input placeholder="key" v-model:value="state.newFieldForm.key" />
      </a-form-item>
      <!-- dt -->
      <a-form-item label="Field Type" required>
        <a-select
          v-model:value="state.newFieldForm.fieldType"
          :disabled="!state.isAddingField"
        >
          <a-select-option :value="1">KV</a-select-option>
          <a-select-option :value="2">LIST</a-select-option>
          <a-select-option :value="3">DICTIONARY</a-select-option>
        </a-select>
      </a-form-item>
      <!-- pairs -->
      <a-form-item label="Related Pairs" required>
        <a-list :data-source="state.newFieldForm.pairs">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-space>
                <a-input
                  :value="item.key"
                  :disabled="state.newFieldForm.fieldType != 3"
                  placeholder="alias for pair"
                />
                <a-auto-complete
                  v-model:value="item.pairKey"
                  :options="options"
                  style="width: 150px"
                  placeholder="input to match pair"
                  @select="onSelect"
                  @search="onSearch"
                />
                <a-button
                  shape="circle"
                  type="danger"
                  @click="hdlNewFieldRemovePair(item, index)"
                  ><DeleteOutlined
                /></a-button>
              </a-space>
            </a-list-item>
          </template>

          <template #footer>
            <a-button
              type="dashed"
              style="width: 100%"
              @click="hdlNewFieldAddPair"
            >
              <PlusOutlined /> Add</a-button
            >
          </template>
        </a-list>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- following template includes all containers fields -->
  <div style="padding: 0 24px">
    <a-table
      :columns="columns"
      :data-source="state.fields"
      bordered
      :pagination="false"
    >
      <template #fieldkey="{ record: field }">
        <span>{{ field.key }}</span>
      </template>

      <template #fieldtype="{ record: field }">
        <a-tag color="geekblue">{{
          translateFieldType(field.fieldType).toUpperCase()
        }}</a-tag>
      </template>

      <template #fieldop="{ record: field, index }">
        <a-space size="middle">
          <a-button
            type="danger"
            shape="circle"
            @click="hdlDelContainerField(field.key, index)"
            size="small"
            ><DeleteOutlined color="red" />
          </a-button>

          <a-button
            type="primary"
            shape="circle"
            @click="hdlEditContainerField(field.key, index)"
            size="small"
            ><EditOutlined color="green" />
          </a-button>
        </a-space>
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
            <span>{{ pair.key }}</span>
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
import { pagingPairs } from "/@/services/pairs";
import {
  translateFieldType,
  translateDatatype,
  transformField,
  transformIntoField,
} from "/@/services/mapping";
import { throttle } from "/@/utils/throttle.ts";
import { message } from "ant-design-vue";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
  },

  props: {
    editingMode: "",
  },

  setup(props) {
    // const formRef = ref();
    const route = useRoute();
    const state = reactive({
      ns: route.params.ns,
      key: route.params.containerKey,
      checksum: "",
      fields: [],
      isCreating: props.editingMode === "creating",
      visible: false,
      newFieldForm: {
        key: "",
        fieldType: 1,
        pairs: [],
      },
      isAddingField: false,
    });

    const hdlDelContainerField = (fieldKey, index) => {
      // console.log(fieldKey, index);
      state.fields.splice(index, 1);
    };

    const hdlEditContainerField = (fieldKey, index) => {
      // console.error("implement me", fieldKey, index);
      state.visible = true;
      state.newFieldForm = state.fields[index];
    };

    const hdlAddContainerField = () => {
      // TODO(@yeqown): valid newFieldForm
      if (state.newFieldForm) {
        state.fields.push(state.newFieldForm);
      }
    };

    const hdlAddFieldTrigger = () => {
      state.visible = true;
      state.isAddingField = true;
    };

    const resetNewFieldForm = () => {
      state.newFieldForm = { key: "", fieldType: 1, pairs: [] };
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
      state.checksum = data.checkSum;
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
      {
        title: "OP",
        slots: {
          customRender: "fieldop",
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

    const hdlNewFieldAddPair = () => {
      if (!state.newFieldForm.pairs) {
        state.newFieldForm.pairs = [];
      }
      state.newFieldForm.pairs.push({ key: "", pairKey: "" });
    };

    const hdlNewFieldRemovePair = (item, index) => {
      if (index < 0) {
        return;
      }
      state.newFieldForm.pairs.splice(index, 1);
    };

    let options = ref([]);

    const onSearch = throttle(async (searchText) => {
      // DONE(@yeqown): slow down the frequency of calling search API.
      console.log(searchText);
      let data = await pagingPairs(state.ns, { limit: 100, key: searchText });
      // console.log(data);
      if (data && data.pairs) {
        let arr = [];
        data.pairs.forEach((pair, index) => {
          arr.push({
            text: pair.key + translateDatatype(pair.datatype),
            value: pair.key,
          });
          options.value = arr;
          console.log(options.value);
        });
      }
    }, 300);

    const onSelect = (value) => {
      console.log("==============select value=", value);
    };

    return {
      state,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },

      translateFieldType,
      hdlCreateOrUpdate,
      hdlDelContainerField,
      hdlEditContainerField,
      hdlAddContainerField,
      hdlAddFieldTrigger,

      hdlNewFieldAddPair,
      hdlNewFieldRemovePair,
      resetNewFieldForm,

      columns,
      fieldPairsColumns,

      options,
      onSearch,
      onSelect,
    };
  },
};
</script>

<style scoped>
tr:last-child td {
  padding-bottom: 0;
}
.content {
  display: flex;
}
</style>
