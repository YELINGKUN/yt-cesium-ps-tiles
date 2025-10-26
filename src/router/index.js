import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("../components/HelloWorld.vue"),
  },
  {
    path: "/helloWorld",
    component: () => import("../components/HelloWorld.vue"),
  },
  {
    path: "/polylineFluid",
    component: () => import("../components/cbc/polylineFluid.vue"),
  },
  {
    path: "/polylineFluid1",
    component: () => import("../components/cbc/polylineFluid1.vue"),
  },
  {
    path: "/corridorFluid",
    component: () => import("../components/cbc/corridorFluid.vue"),
  },
  {
    path: "/model",
    component: () => import("../components/cbc/model.vue"),
  },
  {
    path: "/brightness",
    component: () => import("../components/cbc/brightness.vue"),
  },
  {
    path: "/area",
    component: () => import("../components/cbc/area.vue"),
  },
  {
    path: "/areaback",
    component: () => import("../components/cbc/areaback.vue"),
  },
  {
    path: "/heightPolygon",
    component: () => import("../components/cbc/heightPolygon.vue"),
  },
  {
    path: "/map",
    component: () => import("../components/gis/map.vue"),
  },
  {
    path: "/testMap",
    component: () => import("../components/gis/testMap.vue"),
  },

  {
    path: "/twin",
    component: () => import("../components/twin/index.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(), // hash路由模式
  // history: createWebHistory(),  // history路由模式
  routes,
});
export default router;
