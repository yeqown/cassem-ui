<template>
  <div>
    <a-row style="margin-bottom: 24px">
      <a-alert
        message="配置内容会本地格式化，语法检查，务必和选择的格式一致否则无法提交。"
      />
    </a-row>
    <a-row style="margin-bottom: 24px">
      <codemirror
        :value="elemContent"
        :options="options"
        ref="myEditor"
        @change="handleEditorChange"
      />
      <!-- <span>elemContent: {{ elemContent }}</span>
      <br />
      <span>code: {{ code }}</span> -->
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-button :loading="loading" type="primary" @click="nextStep">{{
          elemContent.length > 0 ? "更新" : "提交"
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
import "codemirror/mode/javascript/javascript"; // json
import "codemirror/mode/toml/toml"; // toml
import "codemirror/mode/yaml/yaml"; // yaml
// import "codemirror/mode/null/null"; // plaintext
import "codemirror/mode/properties/properties"; // ini
import "codemirror/theme/dracula.css";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import { CONTENT_TYPE_VALUES } from "../../config";
export default {
  name: "Step2",
  i18n: require("./i18n"),
  components: { codemirror },
  props: {
    elemContent: String,
    contentType: Number,
  },
  data() {
    return {
      loading: false,
      code: "",
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
  created() {
    // console.log("Step2 created", this.elemContent, this.code);
    console.log(CONTENT_TYPE_VALUES);
    switch (this.contentType) {
      case CONTENT_TYPE_VALUES["JSON"]:
        this.options.mode = "javascript";
        break;
      case CONTENT_TYPE_VALUES["YAML"]:
        this.options.mode = "yaml";
        break;
      case CONTENT_TYPE_VALUES["PLAINTEXT"]:
        this.options.mode = "null";
        break;
      case CONTENT_TYPE_VALUES["INI"]:
        this.options.mode = "properties";
        break;
    }
  },
  mounted() {
    this.editor.focus();
    // this.code = this.elemContent;
    // console.log("Step2 mounted", this.elemContent, this.code);
  },
  methods: {
    nextStep() {
      let _this = this;
      _this.loading = true;
      setTimeout(function () {
        _this.$emit("nextStep", { final: true });
        _this.loading = false;
      }, 500);
    },
    prevStep() {
      this.$emit("prevStep");
    },
    handleEditorChange() {
      // console.log("editor value: ", this.editor.getValue());
      this.$emit("update:elemContent", this.editor.getValue());
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
