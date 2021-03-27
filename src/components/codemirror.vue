<template>
  <div>
    <!-- <textarea ref="editorRef" v-model="state.content"></textarea> -->
    <textarea v-model="state.content"></textarea>
  </div>
</template>

<script>
import { reactive, onMounted, ref, watch } from "vue";
import codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
// import "codemirror/theme/duotone-light.css";

export default {
  name: "CodeMirror",

  props: {
    code: String,
  },

  setup(props, { emit }) {
    const state = reactive({
      content: "",
    });

    const options = {
      autofocus: true,
      mode: "text/javascript",
      theme: "idea",
      lineNumbers: true,
      line: true,
      styleActiveLine: true,
      cursorHeight: 0.85,
    };

    const editorRef = ref();
    const editor = ref();
    const createEditor = () => {
      editor.value = new codemirror.fromTextArea(editorRef.value, options);
      editor.value.on("change", (e) => {
        if (props.code === e.getValue()) {
          console.log("same text content, so ignored");
          return;
        }
        // state.doc = e.getValue();
        // console.log("changed calling");
        emit("change");
      });

      console.log(editor.value);

      editor.value.getTextArea().focus();
      // editorRef.value.focus();
    };

    watch(
      () => {
        return props.code;
      },
      (newValue, preValue) => {
        console.log(
          "codemirror detected props changed.... new: " +
            newValue +
            "old: " +
            preValue
        );

        state.content = newValue;
        // editor.value.setValue(newValue);
        // editor.value.setCursor({ line: 0, ch: 0 });
        // editor.value.getTextArea().value = newValue;
      }
    );

    onMounted(() => {
      console.log("mounted called, props=======", props, props.code);
      // createEditor();
    });

    return { state, editorRef };
  },
};
</script>

<style scoped>
</style>