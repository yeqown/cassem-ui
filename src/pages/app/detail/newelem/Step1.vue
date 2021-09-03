<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0">
      <a-form-item
        label="配置名"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        required
      >
        <a-input :value="key" />
      </a-form-item>
      <a-form-item
        label="内容格式"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        required
      >
        <a-select :value="contentType" placeholder="ant-design@alipay.com">
          <a-select-option :value="1">JSON</a-select-option>
          <a-select-option :value="2">TOML</a-select-option>
          <a-select-option :value="3">INI</a-select-option>
          <a-select-option :value="4">PLAINTEXT</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 17, offset: 7 }">
        <a-button type="primary" @click="nextStep">{{
          $t("nextStep")
        }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "Step1",
  i18n: require("./i18n"),
  data() {
    return {
      key: "",
      contentType: 1,
    };
  },
  methods: {
    nextStep() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped>
</style>
