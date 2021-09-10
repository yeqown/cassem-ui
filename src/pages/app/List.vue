<template>
  <div>
    <a-card :bordered="false" class="search-form">
      <a-row>
        <a-col :span="8">
          <a-input v-model="search" placeholder="输入应用前缀"></a-input>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" style="margin-left: 8px" @click="searchApps"
            >搜索</a-button
          >
        </a-col>
      </a-row>
    </a-card>

    <a-list
      :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
      style="margin: 0 -8px"
    >
      <a-list-item
        v-for="(app, index) in apps"
        :key="`${app.id}-${index}`"
        style="padding: 0 8px"
      >
        <!-- <span>{{ app }}</span> -->
        <a-card :hoverable="true" @click="handleJumpToAppDetail(app.id)">
          <img
            slot="cover"
            src="https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png"
            height="154"
          />
          <a-card-meta :title="app.id">
            <div slot="description">
              {{ app.creator }} 创建于 {{ relativeTime(app.createdAt) }}
            </div>
          </a-card-meta>
          <div class="content">
            <span> {{ app.description }} </span>
          </div>

          <template slot="actions" class="ant-card-actions">
            <a-tooltip>
              <template slot="title"> 编辑 </template>
              <a-icon key="edit" type="edit" :style="{ color: '#40a9ff' }" />
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> 删除 </template>
              <a-popconfirm
                title="确认要删除这个应用吗"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDeleteApp(elem.metadata.key)"
              >
                <a-icon
                  key="delete"
                  type="delete"
                  :style="{ color: '#eb2f96' }"
                />
              </a-popconfirm>
            </a-tooltip>
          </template>
        </a-card>
      </a-list-item>
    </a-list>

    <div v-show="hasMore">
      <a @click="turePageApps">加载更多</a>
    </div>
  </div>
</template>

<script>
// import AvatarList from "../../components/tool/AvatarList";
// import FormRow from "../../components/form/FormRow";
import { getApps, deleteApp } from "../../services/app";
import { humandate } from "../../utils/humandate";
// const AvatarListItem = AvatarList.Item;

const LIMIT = 8;

export default {
  name: "List",
  components: {},
  data() {
    return {
      apps: null,
      search: "",
      nextSeek: "",
      hasMore: false,
    };
  },
  computed: {
    desc() {
      return "可以通过应用名进行简单搜索，如: web-server";
    },
  },
  created() {
    this.searchApps({});
  },
  methods: {
    searchApps() {
      this.listApps({});
    },
    turePageApps() {
      this.listApps({ append: true });
    },

    listApps({ append = false }) {
      console.log("listApps", this.search, this.nextSeek, LIMIT);

      const seek = this.search || this.nextSeek || "";
      getApps(seek, LIMIT).then((res) => {
        const { apps, hasMore, nextSeek } = res.data.data;
        if (append) {
          this.apps = this.apps.concat(apps);
        } else {
          this.apps = apps;
        }

        this.hasMore = hasMore;
        this.nextSeek = nextSeek;
        this.search = "";
      });
    },
    relativeTime(seconds) {
      seconds = seconds - new Date().getTime() / 1000;
      return humandate.relativeTime(seconds, {
        pastSuffix: "前",
        futureSuffix: "后",
      });
    },
    handleJumpToAppDetail(appId) {
      if (!appId) {
        console.error("could not jump to detail, since appId is: ", appId);
        return;
      }
      this.$router.push({
        path: `/application/detail/${appId}`,
      });
    },
    handleDeleteApp(app) {
      deleteApp(app).then(() => {
        this.listApps();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search-form {
  margin-bottom: 24px;
}

.content {
  display: flex;
  margin-top: 16px;
  margin-bottom: -4px;
  line-height: 20px;
  height: 20px;
  & > span {
    color: @text-color-second;
    flex: 1;
    font-size: 12px;
  }
  .avatarList {
    flex: 0 1 auto;
  }
}
</style>
