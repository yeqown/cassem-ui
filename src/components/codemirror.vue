<template>
  <div class="codemirror" ref="editor" style="height: 200px"></div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import codemirror from "codemirror";

export default {
  name: "App",

  props: {
    code: "",
  },

  setup(props) {
    console.log("props==============", props.code);
    const state = reactive({});

    const codemirrorConfig = {
      tabSize: 4,
      styleActiveLine: true,
      lineNumbers: true,
      lineWrapping: false,
      line: true,
      mode: "text/x-src",
      theme: "default",
      cursorHeight: 1,
      lineWiseCopyCut: true,
    };

    const codemirrorview = ref(null);
    const editorScrollHeight = ref(0);
    const editor = ref(null);
    const createEditor = () => {
      editor.value = new codemirror(codemirrorview.value, {
        value: "",
        onload: (data) => {
          log("data is data");
          //   const {
          //     doc: { height = 0 },
          //   } = data;
          //   editorScrollHeight.value = height;
        },
        ...codemirrorConfig,
      });
    };

    onMounted(() => {
      //console.log(marked)
      console.log("called on mount");
      createEditor();
    });

    return { state, codemirrorview, editor, codemirrorConfig };
  },
};
</script>

<style scoped>
</style>