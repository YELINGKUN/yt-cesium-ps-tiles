<template>
  <div id="cesiumContainer" style="
      background-image: url(./FFCesiumExample/advancedTools/images/back.png);
    "></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "../../FFCesium/core/index.js";

import areaHeightJson from "./js/areaHeight.json";

import * as Cesium from "cesium";
import * as turf from "@turf/turf";

let ffCesium = null;
onMounted(() => {
  let viewerOption = {
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
    shadows: true, //是否显示背影
    shouldAnimate: true,
    baseLayer: false,
    // 透明必须设置true
    orderIndependentTranslucency: true,
    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  };
  ffCesium = new FFCesium("cesiumContainer", viewerOption);
  ffCesium.addTdtImgLayer();

  ffCesium.viewer.scene.verticalExaggeration = 8.0;
  // 启用地形
  ffCesium.viewer.scene.globe.depthTestAgainstTerrain = true;
  // 开启抗锯齿
  ffCesium.viewer.scene.postProcessStages.fxaa.enabled = true;
  //定位
  ffCesium.setView({
    lng: 118.09,
    lat: 24.24,
    height: 125000,
    pitchRadiu: -52,
  });



  const orangePolygon1 = ffCesium.viewer.entities.add({
    name: "Orange polygon with per-position heights and outline",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        118.09633969744071, 24.46833535878802, 118.10357867498391,
        24.468017417930763, 118.11272376085279, 24.46789086769148,
        118.11219847075068, 24.474080971248686, 118.10258618951411,
        24.474450353387315, 118.09479782452333, 24.47437713898406,
      ]),
      extrudedHeight: 100,
      perPositionHeight: false,
      material: Cesium.Color.ORANGE.withAlpha(1),
    },
  });
  let zbc = areaHeightJson.coordinates[0][0];
  //createPolygonfromPolylineLngLatArr(zbc);
});

const createPolygonfromPolylineLngLatArr = (zbc) => {
  console.log("zbc", zbc);
  var poly = turf.lineString(zbc);
  console.log("poly", poly);
  // 设置缩小边界的距离，这里假设我们想要缩小0.1单位的边界
  const distance = -0.2; // 负值表示缩小边界
  // 使用buffer方法缩小边界
  const scaledPoly = turf.buffer(poly, distance, { units: "miles" });
  // 输出缩小后的边界
  console.log("addScaleArea--scaledPoly", scaledPoly);

  const distance1 = -0.1; // 负值表示缩小边界
  // 使用buffer方法缩小边界
  const scaledPoly1 = turf.buffer(poly, distance1, { units: "miles" });
  console.log("addScaleArea--scaledPoly1", scaledPoly1);
};
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
