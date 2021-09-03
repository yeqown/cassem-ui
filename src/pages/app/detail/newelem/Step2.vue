<template>
  <div>
    <a-row style="margin-bottom: 24px">
      <a-alert
        message="配置内容会本地格式化，语法检查，务必和选择的格式一致否则无法提交。"
      />
    </a-row>
    <a-row style="margin-bottom: 24px">
      <!-- TODO: 使用文本编辑器 -->
      <a-textarea> </a-textarea>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-button :loading="loading" type="primary" @click="nextStep">{{
          $t("submit")
        }}</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">{{
          $t("preStep")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Step2",
  i18n: require("./i18n"),
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    nextStep() {
      let _this = this;
      _this.loading = true;
      setTimeout(function () {
        _this.$emit("nextStep");
      }, 1500);
    },
    prevStep() {
      this.$emit("prevStep");
    },
  },
};
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;
  :global {
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
}
</style>
