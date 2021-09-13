<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model :model="form" ref="refForm" :rules="rules">
      <a-form-model-item
        :label="$t('title')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        prop="title"
        required
      >
        <a-input :placeholder="$t('titleInput')" v-model="form.title" />
      </a-form-model-item>

      <a-form-model-item
        :label="$t('appId')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        prop="appId"
        required
      >
        <a-input :placeholder="$t('appIdInput')" v-model="form.appId" />
      </a-form-model-item>

      <a-form-model-item
        :label="$t('describe')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        prop="desc"
        required
      >
        <a-textarea
          rows="4"
          :placeholder="$t('describeInput')"
          v-model="form.desc"
        />
      </a-form-model-item>
      <a-form-model-item
        style="margin-top: 24px"
        :wrapperCol="{ span: 10, offset: 7 }"
      >
        <a-button type="primary" @click="handleSubmit">{{
          $t("submit")
        }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { createApp } from "../../../services/app";
export default {
  name: "Form",
  i18n: require("./i18n"),
  data() {
    return {
      form: {
        title: "",
        appId: "",
        desc: "",
      },
      rules: {
        title: [{ required: true, message: this.$t("titleInput") }],
        appId: [{ required: true, message: this.$t("appIdInput") }],
        desc: [{ required: true, message: this.$t("describeInput") }],
      },
    };
  },
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.refForm.validate((valid) => {
        if (!valid) {
          this.$router.push("/application/error");
          return;
        }
        createApp({
          name: this.form.title,
          appId: this.form.appId,
          desc: this.form.desc,
        }).then(() => {
          this.$router.push({
            path: "/application/success",
            query: { appId: this.form.appId },
          });
        });
      });
    },
  },
};
</script>

<style scoped>
</style>
