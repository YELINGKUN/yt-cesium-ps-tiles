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
  {
    path: "/test",
    name: "CesiumPlusManagerTest",
    component: () => import("../components/test.vue"),
    meta: {
      title: "CesiumPlusManager 测试",
      description: "多实例管理器功能测试页面",
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(), // hash路由模式
  // history: createWebHistory(),  // history路由模式
  routes,
});
export default router;
