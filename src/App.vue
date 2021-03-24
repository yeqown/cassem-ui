<template>
  <a-layout class="layout">
    <header>
      <router-link to="/"><h2 class="logo">CASSEM·UI</h2></router-link>
      <a-menu
        theme="light"
        mode="horizontal"
        :multiple="false"
        v-model:selectedKeys="state.selectedKeys"
        :style="{ lineHeight: '64px' }"
        @click="hdlClickMenuItem"
      >
        <a-menu-item key="ns"
          ><h3 style="lineheight: 64px; margin: 0">NAMESPACE</h3></a-menu-item
        >
        <a-menu-item key="doc"
          ><h3 style="lineheight: 64px; margin: 0">DOCUMENTION</h3></a-menu-item
        >
        <a-menu-item key="github"
          ><h3 style="lineheight: 64px; margin: 0">GITHUB</h3></a-menu-item
        >
      </a-menu>
    </header>

    <a-layout-content style="padding: 50px; height: 100%">
      <router-view></router-view>
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      CASSEM-UI ©2021
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { defineComponent, reactive } from "vue";
import router from "./router";

export default defineComponent({
  name: "App",
  setup() {
    const state = reactive({
      selectedKeys: [],
    });

    const hdlClickMenuItem = ({ key }) => {
      // console.log("clicked", key, keyPath);
      switch (key) {
        case "ns":
          router.push({ path: "/namespaces" });
          break;
        case "doc":
          router.push({ path: "/docs" });
          break;
        case "github":
          window.open("https://github.com/yeqown/cassem");
          break;
      }
    };

    return { state, hdlClickMenuItem };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 50px;
  color: #5757d2;
  /* background: rgba(218 , 36, 36, 0.3); */
}

.layout {
  min-height: 100%;
  height: 100%;
}
</style>
