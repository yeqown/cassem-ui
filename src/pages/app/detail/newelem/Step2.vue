<template>
  <div>
    <a-row style="margin-bottom: 24px">
      <a-alert
        message="配置内容会本地格式化，语法检查，务必和选择的格式一致否则无法提交。"
      />
    </a-row>
    <a-row style="margin-bottom: 24px">
      <codemirror
        v-model="code"
        :options="options"
        ref="myEditor"
        @change="handleEditorChange"
      />
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
import { codemirror } from "vue-codemirror-lite";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
export default {
  name: "Step2",
  i18n: require("./i18n"),
  components: { codemirror },
  data() {
    return {
      loading: false,
      code: "function foo() { console.log('this is a')}",
      options: {
        // https://codemirror.net/doc/manual.html#config more options theme: mode:
        theme: "dracula",
        smartIndent: true,
        tabSize: 2,
        mode: "text/javascript",
        lineNumbers: true,
        readOnly: false,
      },
    };
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor;
    },
  },
  mounted() {
    this.editor.focus();
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
    handleEditorChange() {},
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
