<template>
  <div
    id="cesiumContainer"
    style="
      background-image: url(./FFCesiumExample/advancedTools/images/back.png);
    "
  ></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "../../FFCesium/core/index.js";
import areaJson from "./js/bigarea.json";
//import areaJson from "./js/area.json";

import areaHeightJson from "./js/areaHeight.json";

import * as Cesium from "cesium";
import * as turf from "@turf/turf";

console.log("areaJson", areaJson);

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
    lng: 130.25461155821515,
    lat: 46.00925403799818,
    height: 125000,
    pitchRadiu: -52,
  });

  let pointList = areaJson.coordinates[0][0];
  console.log("pointList", pointList);

  let latlngArr = [];
  pointList.forEach((item, index) => {
    latlngArr.push(item[0]);
    latlngArr.push(item[1]);
  });
  //console.log("latlngCroppingArr111", latlngArr);

  addTerrainFun();
  console.log("地形叠加完成");
  //addScaleArea();
});
const addScaleArea = () => {
  let pointList = areaJson.coordinates[0][0];
  console.log("addScaleArea--pointList", pointList);
  pointList.push(pointList[0]);
  var poly = turf.polygon([pointList]);
  // 设置缩小边界的距离，这里假设我们想要缩小0.1单位的边界
  const distance = 0.3; // 负值表示缩小边界
  // 使用buffer方法缩小边界
  const scaledPoly = turf.buffer(poly, distance, { units: "miles" });
  // 输出缩小后的边界
  console.log("addScaleArea--scaledPoly", scaledPoly);

  let lngLatArr = scaledPoly.geometry.coordinates[0];

  //裁剪-start

  var options = { tolerance: 0.005, highQuality: true };
  var simplified = turf.simplify(scaledPoly, options);
  console.log("simplified", simplified);

  let latlngCroppingArr = [];
  simplified.geometry.coordinates[0].forEach((item, index) => {
    latlngCroppingArr.push(item[0]);
    latlngCroppingArr.push(item[1]);
  });
  latlngCroppingArr.push(simplified.geometry.coordinates[0][0][0]);
  latlngCroppingArr.push(simplified.geometry.coordinates[0][0][1]);

  console.log("latlngCroppingArr", latlngCroppingArr);
  //ffCesium.showMapByAreaLngLat(latlngCroppingArr);
  //裁剪-end

  //addPolygonFun(lngLatArr);

  // ffCesium.viewer.entities.add({
  //   name: "Red polygon on surface",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArray(
  //       scaledPoly.geometry.coordinates[0].flat()
  //     ),
  //     width: 5,
  //     material: Cesium.Color.BLUE,
  //     clampToGround: true,
  //   },
  // });
};

const addPolygonFun = (lngLatArr) => {
  let pointList = areaJson.coordinates[0][0];
  for (let i = pointList.length - 1; i > 0; i--) {
    lngLatArr.push(pointList[i]);
  }
  console.log("lngLatArr", lngLatArr);
  ffCesium.viewer.entities.add({
    name: "Red polygon on surface",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(lngLatArr.flat()),
      material: Cesium.Color.RED,
    },
  });
};

const addTerrainFun = async () => {
  // let terrainLayer = await ffCesium.addTerrain(
  //   "http://data.marsgis.cn/terrain"
  // );
  let terrainLayer = await ffCesium.addTerrain(
    "http://112.48.26.30:24518/gis-mapServer/JMSDX"
  );

  console.log("terrainLayer", terrainLayer);
  addWaiwei();
};

const addWaiwei = async () => {
  let pointList = areaJson.coordinates[0][0];
  console.log("addWaiwei--pointList", pointList.flat());

  let holeArr = [];
  holeArr.push({
    positions: Cesium.Cartesian3.fromDegreesArray(pointList.flat(Infinity)),
  });

  console.log("holeArr", holeArr);

  // 遮罩
  let polygonEntity = new Cesium.Entity({
    polygon: {
      hierarchy: {
        // 添加外部区域为1/4半圆，设置为180会报错
        positions: Cesium.Cartesian3.fromDegreesArray([
          0, 0, 0, 90, 179, 90, 179, 0,
        ]),
        // 中心挖空的“洞”
        holes: holeArr,
      },
      material: Cesium.Color.fromCssColorString("#0C1522").withAlpha(0.8),
      // material: Cesium.Color.TRANSPARENT.withAlpha(0.0),
      //extrudedHeight: 0,
    },
  });

  ffCesium.viewer.entities.add(polygonEntity);

  let tt = [];
  for (let i = 0; i < pointList.length; i++) {
    let arrTemp = [];
    arrTemp.push(pointList[i][0]);
    arrTemp.push(pointList[i][1]);
    arrTemp.push(2000);
    tt.push(arrTemp);
  }

  console.log("tt123", tt);

  ffCesium.viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(tt.flat()),
      material: Cesium.Color.GREEN,
      outline: false,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 100.0,
    },
  });

  /**
  ffCesium.viewer.entities.add({
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
      shape: [
        new Cesium.Cartesian2(-1, -1),
        new Cesium.Cartesian2(50, -1),
        new Cesium.Cartesian2(50, 1),
        new Cesium.Cartesian2(-1, 1),
      ],
      //cornerType: Cesium.CornerType.BEVELED,
      material: Cesium.Color.GREEN.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
   */

  /**
  for (let i = 0; i < pointList.length; i++) {
    let heightTemp = await ffCesium.getHeightAtPoint(pointList[i]);
    pointList[i].push(heightTemp);
    //console.log("i", i);
    //console.log("pointList243", pointList);
  }
  let str = "";
  for (let i = 0; i < pointList.length; i++) {
    str =
      str +
      "[" +
      pointList[i][0] +
      "," +
      pointList[i][1] +
      "," +
      pointList[i][2] +
      "],";
  }
       */
  //console.log("str", str);

  //console.log("pointList243", pointList);

  // ffCesium.viewer.entities.add({
  //   polylineVolume: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
  //     shape: [
  //       new Cesium.Cartesian2(-50, -50),
  //       new Cesium.Cartesian2(50, -50),
  //       new Cesium.Cartesian2(50, 50),
  //       new Cesium.Cartesian2(-50, 50),
  //     ],
  //     cornerType: Cesium.CornerType.BEVELED,
  //     material: Cesium.Color.GREEN.withAlpha(0.5),
  //     outline: true,
  //     outlineColor: Cesium.Color.BLACK,
  //   },
  // });
};
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
