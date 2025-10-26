<template>
  <div id="cesiumViewer">
    <!-- <div style="position: absolute; left: 100px; top: 100px; z-index: 999">
        <img :src="imagebase64" />
      </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import * as turf from "@turf/turf";

import flickerBase64 from "./images/flicker.png";
import PolylineFlow from "./js/polylineFlow.js";

import polylineEffect8 from "./images/polylineEffect8.png";
import polylineEffect9 from "./images/river.png";
//import polylineEffect9 from "./images/polylineEffect9.png";

let imagebase64 = ref("");

var mapOption = {
  //url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  url: "http://112.48.26.30:24518/tdt/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa", //高德地图
};
var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);

let viewer = null;

onMounted(() => {
  var viewerOption = {
    animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/2D选择器
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: false, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    baselLayerPicker: false, // 将图层选择的控件关掉，才能添加其他影像数据
    shadows: false, //是否显示背影
    shouldAnimate: true,
  };
  viewer = new Cesium.Viewer("cesiumViewer", viewerOption);
  viewer.imageryLayers.get(0).show = false; //不加载cesium默认地图
  viewer._cesiumWidget._creditContainer.style.display = "none"; //去除版权信息
  viewer.imageryLayers.addImageryProvider(imgProvider);
  console.log("viewer.imageryLayers", viewer.imageryLayers);

  viewer.imageryLayers.get(0).gamma = 0.75;

  viewer.imageryLayers.get(1).gamma = 0.75;

  viewer.scene.globe.depthTestAgainstTerrain = true;

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      130.12461155821515,
      46.71925403799818,
      55000
    ),
    orientation: {
      // 指向
      heading: Cesium.Math.toRadians(0),
      // 视角
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });
  console.log("viewer1", viewer);

  // 亮度设置
  var stages = viewer.scene.postProcessStages;
  viewer.scene.brightness =
    viewer.scene.brightness ||
    stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
  viewer.scene.brightness.enabled = true;
  viewer.scene.brightness.uniforms.brightness = Number(2);
  let scene = viewer.scene;
  console.log("1qw", scene);

  viewer.scene.light.color = Cesium.Color.RED;
  /*
  viewer.scene.sunBloom = true;
  viewer.scene.globe.enableLighting = true;
  //   viewer.scene.sunColor = Cesium.Cartesian3(0, 0, 1.0);
  // 设置太阳颜色
  viewer.scene.sun.diffuse = new Cesium.Color(1.0, 0.5, 0.3); // 设置太阳的发光颜色为橙色
  viewer.scene.sun.specular = new Cesium.Color(1.0, 0.5, 0.3); // 设置太阳的镜像颜色
  */

  /** 
  // 设置太阳颜色为红色
  scene.sun.diffuse = new Cesium.Color(1.0, 0.0, 0.0, 1.0); // 红色
  scene.sun.specular = new Cesium.Color(1.0, 0.0, 0.0, 1.0); // 红色

  // 设置环境光颜色，使得太阳光照下的地球颜色接近红色
  scene.globe.baseColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0); // 红色

  // 设置大气颜色，使得太阳光照下的大气颜色接近红色
  scene.skyAtmosphere.rayleigh = new Cesium.Color(1.0, 0.0, 0.0, 1.0); // 红色

  // 设置太阳光照强，增强阳光的照射效果
  scene.sun.sunBrightness = 1.0;

  // 设置地球的环境光强度
  scene.ambientLightColor = new Cesium.Color(0.5, 0.0, 0.0, 0.5); // 半透明红色
  */
});
</script>

<style scoped>
#cesiumViewer {
  width: 100%;
  height: 100%;
}
</style>
