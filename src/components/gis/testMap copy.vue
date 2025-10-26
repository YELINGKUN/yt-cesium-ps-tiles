<template>
  <div
    class="fatherDivClass"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    "
  >
    <div class="rotating-background1"></div>
    <div class="rotating-background2"></div>
    <div class="rotating-background3"></div>
    <div class="rotating-background4"></div>
  </div>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "../../FFCesium/core/index.js";
import areaHeightJson from "./js/areaHeight.json";
//import areaScale from "./js/areaScale.json";
import * as turf from "@turf/turf";
import areaScaleHeight from "./js/areaScaleHeight.json";
import flicker3 from "./images/flicker2.png";

import * as Cesium from "cesium";

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
  //ffCesium.addArcgisImgLayer();
  ffCesium.addTdtImgLayer();

  // 启用地形
  ffCesium.viewer.scene.globe.depthTestAgainstTerrain = true;
  //启用抗锯齿
  ffCesium.viewer.scene.postProcessStages.fxaa.enabled = true;

  ffCesium.setView({
    lng: 130.15461155821515,
    lat: 45.80925403799818,
    height: 155000,
    pitchRadiu: -52,
  });

  //裁剪区域
  let pointList = areaHeightJson.coordinates[0][0];
  let latlngArr = [];
  pointList.forEach((item, index) => {
    latlngArr.push(item[0]);
    latlngArr.push(item[1]);
  });
  ffCesium.showMapByAreaLngLat(latlngArr);

  //叠加面
  //叠加边界线

  for (let i = 0; i < areaHeightJson.coordinates[0][0].length; i++) {
    let point = areaHeightJson.coordinates[0][0][i];
    point[2] = point[2] + 150;
  }

  for (let i = 0; i < areaScaleHeight.coordinates[0][0].length; i++) {
    let point = areaScaleHeight.coordinates[0][0][i];
    point[2] = point[2] + 150;
  }
  console.log("areaScaleHeight1", areaScaleHeight);

  let holes = [
    {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(
        areaScaleHeight.coordinates[0][0].flat()
      ),
    },
  ];
  console.log("holes123", holes);
  let polygonEntity = ffCesium.viewer.entities.add({
    polygon: {
      perPositionHeight: true,
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          areaHeightJson.coordinates[0][0].flat()
        ),
        holes: holes,
      },
      material: Cesium.Color.fromCssColorString("#C3F6FF").withAlpha(1),
    },
  });

  //下边面
  let polygonEntity1 = ffCesium.viewer.entities.add({
    polygon: {
      height: -3000,
      extrudedHeight: -3500.0,
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          areaHeightJson.coordinates[0][0].flat()
        ),
        holes: holes,
      },
      material: Cesium.Color.fromCssColorString("#7FF1FF").withAlpha(1),
      //material: flicker3,
    },
  });

  let terrainLayer = ffCesium.addTerrain("http://data.marsgis.cn/terrain");

  addWaiwei();

  //获取最近点高度
  //getHeight();
});

const addWaiwei = async () => {
  let pointList = areaHeightJson.coordinates[0][0];
  let minimumHeightsArr = [];
  let maximumHeightsArr = [];
  for (let i = 0; i < pointList.length; i++) {
    minimumHeightsArr.push(-3000);
    maximumHeightsArr.push(pointList[i][2]);
  }
  console.log("addWaiwei--pointList", pointList);

  let wallEntity = ffCesium.viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
      //material: Cesium.Color.fromCssColorString("#4ABAE9"),
      material: getColorRamp(),
      minimumHeights: minimumHeightsArr,
      maximumHeights: maximumHeightsArr,
    },
  });
};

const getColorRamp = () => {
  const ramp = document.createElement("canvas");
  ramp.width = 1;
  ramp.height = 100;
  const ctx = ramp.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 0, 100);
  //   grd.addColorStop(0.0, "#ffffff");
  //   grd.addColorStop(1.0, "#ff0000");
  //   grd.addColorStop(0, "rgba(255, 0, 0, 0.5)");
  //   grd.addColorStop(1, "rgba(255, 255, 0, 0.5)");

  //   grd.addColorStop(0, "rgba(84, 87, 30, 0.5)");
  //   grd.addColorStop(1, "rgba(25, 35, 0, 0.5)");

  grd.addColorStop(0, "rgba(74,135,167, 0.5)");
  grd.addColorStop(1, "rgba(33,61,76, 0.5)");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1, 100);

  // 阴影
  //   ctx.shadowColor = "red";
  //   ctx.shadowBlur = 25;
  //   ctx.fillStyle = "blue";
  //   ctx.fillRect(0, 25, 75, 75);

  return ramp;
};

const getHeight = () => {
  //console.log("areaHeightJson", areaHeightJson);
  let areaHeightArr = areaHeightJson.coordinates[0][0];
  let areaScaleArr = areaScale.coordinates[0][0];
  console.log("areaHeightArr", areaHeightArr);
  console.log("areaScaleArr", areaScaleArr);

  var pointsArr = [];
  for (let i = 0; i < areaHeightArr.length; i++) {
    pointsArr.push(turf.point(areaHeightArr[i]));
  }
  let pointCollection = turf.featureCollection(pointsArr);

  for (let i = 0; i < areaScaleArr.length; i++) {
    let targetPoint = turf.point(areaScaleArr[i]);
    var nearest = turf.nearestPoint(targetPoint, pointCollection);
    //console.log("nearest", nearest);
    areaScaleArr[i].push(nearest.geometry.coordinates[2]);
  }
  console.log("areaScaleArr1323", areaScaleArr);

  let str = "";
  for (let i = 0; i < areaScaleArr.length; i++) {
    str =
      str +
      "[" +
      areaScaleArr[i][0] +
      "," +
      areaScaleArr[i][1] +
      "," +
      areaScaleArr[i][2] +
      "],";
  }

  console.log("str123", str);
};
</script>
<style scoped>
#cesiumContainer {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 999;
}
.fatherDivClass {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: url("./back/背景.png"); /* 替换为你的图片路径 */
  background-size: cover; /* 或者其他你需要的大小设置 */
  background-position: center;
  z-index: 1;
}
@keyframes rotateBackground {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotateBackgroundContrary {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.rotating-background1 {
  position: absolute;
  animation: rotateBackground infinite 20s linear;
  background-image: url("./back/右转外圈.png"); /* 替换为你的图片路径 */
  background-size: cover; /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 800px; /* 根据需要设置宽度 */
  height: 800px; /* 根据需要设置高度 */
  /* 其他样式 */
}
.rotating-background2 {
  position: absolute;
  animation: rotateBackground infinite 20s linear;
  background-image: url("./back/右转中大圈.png"); /* 替换为你的图片路径 */
  background-size: cover; /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 700px; /* 根据需要设置宽度 */
  height: 700px; /* 根据需要设置高度 */
  /* 其他样式 */
}
.rotating-background3 {
  position: absolute;
  animation: rotateBackgroundContrary infinite 20s linear;
  background-image: url("./back/左转中圈.png"); /* 替换为你的图片路径 */
  background-size: cover; /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 600px; /* 根据需要设置宽度 */
  height: 600px; /* 根据需要设置高度 */
  /* 其他样式 */
}

.rotating-background4 {
  position: absolute;
  animation: rotateBackground infinite 10s linear;
  background-image: url("./back/右转小圈.png"); /* 替换为你的图片路径 */
  background-size: cover; /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 500px; /* 根据需要设置宽度 */
  height: 500px; /* 根据需要设置高度 */
  /* 其他样式 */
}
</style>
