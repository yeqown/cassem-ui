<template>
  <div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="current">
        <a-step title="基本信息" />
        <a-step title="配置内容" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <step1 v-if="current === 0" @nextStep="nextStep"></step1>
        <step2
          v-if="current === 1"
          @nextStep="nextStep"
          @prevStep="prevStep"
        ></step2>
        <step3
          v-if="current === 2"
          @prevStep="prevStep"
          @finish="finish"
        ></step3>
      </div>
    </a-card>
  </div>
</template>

<script>
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default {
  name: "StepForm",
  i18n: require("./i18n"),
  components: { Step1, Step2, Step3 },
  data() {
    return {
      current: 0,
      appId: "",
      env: "",
    };
  },
  computed: {
    desc() {
      return `在当前应用 ${this.appId} 和环境 ${this.env} 中新增一个配置项`;
    },
  },
  methods: {
    nextStep() {
      if (this.current < 2) {
        this.current += 1;
      }
    },
    prevStep() {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    finish() {
      this.current = 0;
    },
  },
  created() {
    let { appId } = this.$route.params;
    let { env } = this.$route.query;

    if (!appId || !env) {
      this.$message.error("路由参数错误");
      this.$router.back();
      return;
    }

    this.appId = appId;
    this.env = env;
  },
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 950px;
  margin: 16px auto;
}
</style>
