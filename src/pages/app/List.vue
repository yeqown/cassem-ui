<template>
  <div>
    <a-card :bordered="false" class="search-form">
      <a-form :form="form">
        <form-row label="应用名" style="padding-bottom: 11px">
          <a-form-item mode="inline">
            <a-input></a-input>
            <a-button
              type="primary"
              style="margin-left: 8px"
              @click="searchApps"
              >搜索</a-button
            >
          </a-form-item>
        </form-row>
      </a-form>
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
        <a-card>
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
            <!-- <avatar-list>
              <avatar-list-item
                size="small"
                tips="曲丽丽"
                src="https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png"
              />
              <avatar-list-item
                size="small"
                tips="周星星"
                src="https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png"
              />
              <avatar-list-item
                size="small"
                tips="董娜娜"
                src="https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png"
              />
            </avatar-list> -->
          </div>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
// import AvatarList from "../../components/tool/AvatarList";
import FormRow from "../../components/form/FormRow";
import { getApps } from "../../services/app";
import { humandate } from "../../utils/humandate";
// const AvatarListItem = AvatarList.Item;

export default {
  name: "List",
  components: { FormRow },
  data() {
    return {
      apps: null,
      form: null,
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
    this.searchApps();
  },
  methods: {
    searchApps() {
      const seek = this.seek || this.nextSeek || "";
      getApps(seek, 10).then((res) => {
        const { apps, hasMore, nextSeek } = res.data.data;
        this.apps = apps;
        this.hasMore = hasMore;
        this.nextSeek = nextSeek;
      });
    },
    relativeTime(seconds) {
      seconds = seconds - new Date().getTime() / 1000;
      return humandate.relativeTime(seconds, {
        pastSuffix: "前",
        futureSuffix: "后",
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
