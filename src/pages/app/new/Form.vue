<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form>
      <a-form-item
        :label="$t('title')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        required
      >
        <a-input :placeholder="$t('titleInput')" />
      </a-form-item>

      <a-form-item
        :label="$t('appId')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        required
      >
        <a-input :placeholder="$t('appIdInput')" />
      </a-form-item>

      <a-form-item
        :label="$t('describe')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        required
      >
        <a-textarea rows="4" :placeholder="$t('describeInput')" />
      </a-form-item>
      <!-- <a-form-item
        :label="$t('metrics')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-textarea rows="4" :placeholder="$t('metricsInput')" />
      </a-form-item>
      <a-form-item
        :label="$t('customer')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        :required="false"
      >
        <a-input :placeholder="$t('customerInput')" />
      </a-form-item>
      <a-form-item
        :label="$t('critics')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        :required="false"
      >
        <a-input :placeholder="$t('criticsInput')" />
      </a-form-item>
      <a-form-item
        :label="$t('weight')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        :required="false"
      >
        <a-input-number :min="0" :max="100" />
        <span>%</span>
      </a-form-item>
      <a-form-item
        :label="$t('disclosure')"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 10 }"
        :required="false"
        :help="$t('disclosureDesc')"
      >
        <a-radio-group v-model="value">
          <a-radio :value="1">{{ $t("public") }}</a-radio>
          <a-radio :value="2">{{ $t("partially") }}</a-radio>
          <a-radio :value="3">{{ $t("private") }}</a-radio>
        </a-radio-group>
        <a-select mode="multiple" v-if="value === 2">
          <a-select-option value="4">{{ $t("colleague1") }}</a-select-option>
          <a-select-option value="5">{{ $t("colleague2") }}</a-select-option>
          <a-select-option value="6">{{ $t("colleague3") }}</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        style="margin-top: 24px"
        :wrapperCol="{ span: 10, offset: 7 }"
      >
        <a-button type="primary" @click="addApp">{{ $t("submit") }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { createApp } from "../../../services/app";
export default {
  name: "Form",
  i18n: require("./i18n"),
  data() {
    return {
      value: 1,
    };
  },
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
  },
  methods: {
    addApp() {
      // TODO: validate

      createApp({
        name: "测试应用",
        appId: "test",
        desc: "test app creation",
      }).then(() => {
        this.$message.success(this.$t("success"));
      });
    },
  },
};
</script>

<style scoped>
</style>
