<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0" ref="refFormNewElem">
      <a-form-item
        label="配置名"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        required
      >
        <a-input
          v-model="k"
          placeholder="输入配置项的名称"
          @change="
            (e) => {
              // console.log(e, e.target.value);
              const newValue = e.target.value;
              //elemKey = e.target.value;
              this.$emit('update:elemKey', newValue);
            }
          "
          :disabled="disabled"
        />
      </a-form-item>
      <a-form-item
        label="内容格式"
        :labelCol="{ span: 7 }"
        :wrapperCol="{ span: 17 }"
        required
      >
        <a-select
          v-model="ct"
          placeholder="选择一种格式"
          @select="
            (val) => {
              this.$emit('update:contentType', val);
            }
          "
          :disabled="disabled"
        >
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
  props: {
    elemKey: String,
    contentType: Number,
    disabled: Boolean,
  },
  data() {
    return {
      k: "",
      ct: 1,
    };
  },
  methods: {
    nextStep() {
      // console.log(this.k, this.ct, this.elemKey, this.contentType);
      if (!this.elemKey || this.elemKey === "") {
        this.$message.error("请输入配置项的名称");
        return;
      }

      this.$emit("nextStep");
    },
  },
  created() {
    this.k = this.elemKey;
    this.ct = this.contentType;
  },
};
</script>

<style scoped>
</style>
