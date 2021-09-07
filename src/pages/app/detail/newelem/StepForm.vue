<template>
  <div>
    <a-card :bordered="false">
      <a-steps class="steps" :currentStep="currentStep">
        <a-step title="基本信息" />
        <a-step title="配置内容" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <step1
          v-if="currentStep === 0"
          @nextStep="nextStep"
          :elemKey.sync="element.key"
          :contentType.sync="element.contentType"
        ></step1>
        <step2
          v-if="currentStep === 1"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :elemContent.sync="element.value"
        ></step2>
        <step3
          v-if="currentStep === 2"
          @prevStep="prevStep"
          :appId="appId"
          :env="env"
          @finish="finish"
        ></step3>
      </div>
    </a-card>
  </div>
</template>

<script>
import { createAppEnvElement } from "../../../../services/app";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default {
  name: "StepForm",
  i18n: require("./i18n"),
  components: { Step1, Step2, Step3 },
  data() {
    return {
      currentStep: 0,
      appId: "",
      env: "",
      element: {
        key: "",
        contentType: 1,
        value: "",
      },
    };
  },
  computed: {
    desc() {
      return `在当前应用 ${this.appId} 和环境 ${this.env} 中新增一个配置项`;
    },
  },
  methods: {
    nextStep(opt) {
      if (this.currentStep < 2) {
        this.currentStep += 1;
      }

      console.log("============ nextStep, ", opt);
      if (!opt) return;
      let { final = false } = opt;
      if (final) {
        createAppEnvElement({
          appId: this.appId,
          env: this.env,
          key: this.element.key,
          contentType: this.element.contentType,
          value: this.element.value,
        }).then(() => {
          this.$message.success("创建成功");
          // this.$router.push(`/app/${this.appId}/detail/${this.env}`);
        });
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
      }
    },
    finish() {
      this.currentStep = 0;
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
