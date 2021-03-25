import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import router from "./router";
import "ant-design-vue/dist/antd.css";
import VueHighlightJS from 'vue3-highlightjs';
import 'highlight.js/styles/solarized-light.css'

createApp(App).
    use(Antd).
    use(router).
    use(VueHighlightJS).
    mount("#app");
