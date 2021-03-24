<template>
  <a-page-header
    title="NAMESPACES"
    sub-title="all namespace is here"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button type="primary" @click="hdlCreateClick">
        <template #icon><PlusCircleOutlined /></template>
      </a-button>
    </template>
  </a-page-header>

  <a-modal
    v-model:visible="state.visible"
    @ok="doCreate"
    @cancel="doCancel"
    title="New Namespace"
  >
    <label>Key：</label>
    <a-input
      style="width: 80%"
      v-model:value="state.createKey"
      id="createKey"
      placeholder="Input the Namesapce's Key"
    ></a-input>
  </a-modal>

  <div style="padding: 0 24px">
    <a-row :gutter="16">
      <a-col :span="6" v-for="($item, $index) in state.list" :key="$index">
        <a-card :bordered="true" :hoverable="true" size="small">
          <template #cover>
            <img
              alt="example"
              src="http://doulaizhuan-prod1-1251021022.image.myqcloud.com/202004032355280544c44743c30aaedcd89fb81397030e1265140919.png?imageMogr2/thumbnail/600x/format/png/interlace/0"
            />
          </template>

          <template class="ant-card-actions" #actions>
            <edit-outlined key="edit" />

            <router-link :to="`/namespaces/${$item}/containers`">
              <a-popover>
                <template #content>
                  <p>To containers</p>
                </template>
                <container-outlined key="containers" />
              </a-popover>
            </router-link>

            <router-link :to="`/namespaces/${$item}/pairs`">
              <a-popover>
                <template #content>
                  <p>To pairs</p>
                </template>
                <unordered-list-outlined key="pairs" />
              </a-popover>
            </router-link>
          </template>

          <a-card-meta
            :title="$item.toUpperCase()"
            description="TODO: add description"
          >
          </a-card-meta>

          <!-- <router-link :to="`/namespaces/${item}/containers`">
          <p>{{ $item.toUpperCase() }}</p>
        </router-link> -->

          <p>'s description</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { reactive, onMounted, ref } from "vue";
import { getNsList, postCreateNs } from "/@/services/namespace";
import {
  UnorderedListOutlined,
  EditOutlined,
  ContainerOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
export default {
  components: {
    UnorderedListOutlined,
    EditOutlined,
    ContainerOutlined,
    PlusCircleOutlined,
  },
  setup() {
    const state = reactive({
      list: [],
      visible: false,
      createKey: "",
    });

    const getList = async () => {
      state.list = await getNsList({ limit: 10 });
    };

    const hdlCreateClick = () => {
      state.visible = true;
    };

    const doCancel = () => {
      state.visible = false;
      state.createKey = "";
    };

    const doCreate = async () => {
      let res = await postCreateNs(state.createKey);
      if (res.errcode === 0) {
        doCancel();
        getList();
      }
    };

    onMounted(() => {
      getList();
    });

    return { state, hdlCreateClick, doCancel, doCreate };
  },
};
</script>
