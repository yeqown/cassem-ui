<template>
  <div>
    <textarea id="editorTextarea" v-model="code" />
  </div>
</template>

<script>
import { reactive, onMounted, watch, ref, nextTick, defineEmit } from "vue";
import codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
// import "codemirror/theme/duotone-light.css";

export default {
  name: "CodeMirror",

  props: {
    code: "",
  },

  setup(props) {
    const state = reactive({
      editor: null,
      doc: "",
    });

    // const emit = defineEmit("")

    const options = {
      // tabSize: 4,
      autofocus: true,
      mode: "text/javascript",
      theme: "idea",
      lineNumbers: true,
      line: true,
      styleActiveLine: true,
      cursorHeight: 0.85,
    };

    // watch(
    //   () => {
    //     return props.code;
    //   },
    //   (value, preValue) => {
    //     console.log("changed ==== ", value, preValue);
    //   }
    // );

    // const editor = ref("");
    const createEditor = () => {
      state.editor = new codemirror.fromTextArea(
        document.getElementById("editorTextarea"),
        options
      );
      // state.editor.setValue(props.code);
      state.editor.on("change", (e) => {
        // console.log("editor changing", e.getValue());
        state.doc = e.getValue();
      });
    };

    onMounted(() => {
      console.log("mounted called, props=======", props.code);
      createEditor();
    });

    // nextTick(() => {
    //   console.log("tick called");
    //   state.editor.refresh();
    // });

    return { state };
  },
};
</script>

<style scoped>
</style>