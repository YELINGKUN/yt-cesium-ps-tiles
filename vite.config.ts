import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cesium from "vite-plugin-cesium";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), cesium()],
  resolve: {
    //路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // 监听所有网络接口，可通过任何网络接口访问
    port: 3000, // 设置端口号
    // 在此处编写代理规则
    // "/JMSDX": {
    //   target: "http://192.168.9.212/JMSDX/",
    //   changeOrigin: true,
    // },
  },
});
