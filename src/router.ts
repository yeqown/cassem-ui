// import Vue, { createApp } from "vue";
import { createWebHashHistory, createRouter, RouteLocation } from "vue-router";
import NameSpaces from "./pages/Namespaces/index.vue";
import Containers from "./pages/Containers/index.vue";
import ContainerEdit from "./pages/Containers/edit.vue";
import Pairs from "./pages/Pairs/index.vue";
import PairEdit from "./pages/Pairs/edit.vue";
import Index from './pages/index.vue';

const dyContainerPropsFn = (route: RouteLocation) => {
  // console.log("========== dyContainerPropsFn called", route.query.m);
  return { editingMode: route.query.m }
}

const routes = [
  {
    path: "/namespaces",
    component: NameSpaces,
  },
  {
    path: "/namespaces/:ns/containers",
    component: Containers,
  },
  {
    path: "/namespaces/:ns/containers/:containerKey",
    component: ContainerEdit,
    props: dyContainerPropsFn,
  },
  {
    path: "/namespaces/:ns/pairs",
    component: Pairs,
  },
  {
    path: "/namespaces/:ns/pairs/:pairKey",
    component: PairEdit,
  },
  {
    path: "/docs",
    redirect: "/namespaces",
  },
  // 重定向
  {
    path: "/",
    component: Index,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
