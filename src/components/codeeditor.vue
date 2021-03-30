<script>
import { defineComponent, h } from "vue";
import ace from "brace";
import "brace/theme/chrome";
import "brace/mode/javascript";

export default defineComponent({
  name: "codeeditor",
  props: {
    modelValue: String,
    lang: {
      type: String,
      default: "text",
    },
    theme: {
      type: String,
      default: "chrome",
    },
    options: {
      type: Object,
      default: {
        minLines: 1,
        maxLines: 1000,
        autoScrollEditorIntoView: true,
        fontSize: 16,
      },
    },
    onChange: {
      type: Function,
      default: function () {
        if (["text"].includes(this.lang)) {
          this.updateValue();
        }
      },
    },
  },
  emits: [
    "update:modelValue",
    "init",
    "validate",
    "change",
    "changeAnnotation",
  ],

  render() {
    return h("div", {});
  },

  data: function () {
    return {
      valid: true,
      editor: null,
      contentBackup: "",
    };
  },
  methods: {
    validate() {
      const annotations = this.editor.getSession().getAnnotations();
      const errors = annotations.filter(({ type }) => type === "error");
      this.valid = !errors.length;
      this.$emit("validate", this.valid);
      return this.valid;
    },

    updateValue() {
      const content = this.editor.getValue();
      this.$emit("update:modelValue", content);
      this.contentBackup = content;
    },

    initEditor() {
      const vm = this;
      const lang = this.lang;
      const mode = typeof lang === "string" ? "ace/mode/" + lang : lang;
      const theme = this.theme;
      const options = {
        minLines: 1,
        maxLines: 1000,
        autoScrollEditorIntoView: true,
        ...(this.options || {}),
      };
      const editor = (vm.editor = ace.edit(this.$el));
      editor.$blockScrolling = Infinity;
      this.$emit("init", editor);
      editor.getSession().setMode(mode);
      editor.setTheme("ace/theme/" + theme);
      if (this.modelValue) editor.setValue(this.modelValue, 1);
      this.contentBackup = this.modelValue;
      editor.on("change", (e) => {
        this.onChange(e, editor);
        this.$emit("change", e);
      });
      editor.getSession().on("changeAnnotation", (e) => {
        // console.log('annotation');
        vm.validate();
        vm.updateValue();
        this.$emit(
          "changeAnnotation",
          this.editor.getSession().getAnnotations()
        );
      });
      editor.setOptions(options);
    },
  },
  watch: {
    modelValue: function (val) {
      if (this.contentBackup !== val) {
        this.editor.session.setValue(val, 1);
        this.contentBackup = val;
      }
    },

    theme: function (newTheme) {
      this.editor.setTheme("ace/theme/" + newTheme);
    },

    lang: function (newLang) {
      this.editor
        .getSession()
        .setMode(typeof newLang === "string" ? "ace/mode/" + newLang : newLang);
    },

    options: function (newOption) {
      const options = {
        minLines: 1,
        maxLines: 1000,
        autoScrollEditorIntoView: true,
        ...(newOption || {}),
      };
      this.editor.setOptions(options);
    },
  },

  mounted() {
    this.initEditor();
  },

  beforeUnmount() {
    this.editor.destroy();
    this.editor.container.remove();
  },
});
</script>