<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "../../FFCesium/core/index.js";
import areaJson from "./js/area.json";
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
  //调整亮度和gamma值
  ffCesium.viewer.imageryLayers.get(0).gamma = 0.75;
  ffCesium.viewer.imageryLayers.get(0).brightness = 1.5;
  // 启用地形
  ffCesium.viewer.scene.globe.depthTestAgainstTerrain = true;
  // 开启抗锯齿
  //ffCesium.viewer.scene.postProcessStages.fxaa.enabled = true;
  //定位
  ffCesium.setView({
    lng: 130.25461155821515,
    lat: 46.00925403799818,
    height: 125000,
    pitchRadiu: -52,
  });
  //叠加地形
  addTerrainFun();
  //裁剪区域
  let pointList = areaJson.coordinates[0][0];
  let latlngArr = [];
  pointList.forEach((item, index) => {
    latlngArr.push(item[0]);
    latlngArr.push(item[1]);
  });
  ffCesium.showMapByAreaLngLat(latlngArr);
  //叠加外围线
  addWaiwei();
  //叠加外围面
  //addWaiweiArea();
});
const addWaiweiArea = () => {
  let pointList = areaJson.coordinates[0][0];
  var poly = turf.polygon([pointList]);
  // 设置缩小边界的距离，这里假设我们想要缩小0.1单位的边界
  const distance = -0.2; // 负值表示缩小边界
  // 使用buffer方法缩小边界
  const scaledPoly = turf.buffer(poly, distance, { units: "miles" });
  console.log("poly123", poly);
  console.log("scaledPoly123", scaledPoly);
  //叠加边界线
  let holes = [
    {
      positions: Cesium.Cartesian3.fromDegreesArray(
        scaledPoly.geometry.coordinates[0].flat()
      ),
    },
  ];
  ffCesium.viewer.entities.add({
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray(pointList.flat()),
        holes: holes,
      },
      material: Cesium.Color.fromCssColorString("#4ABAE9"),
    },
  });
};

const addTerrainFun = async () => {
  // let terrainLayer = await ffCesium.addTerrain(
  //   "http://data.marsgis.cn/terrain"
  // );
  let terrainLayer = await ffCesium.addTerrain(
    "http://112.48.26.30:24518/gis-mapServer/JMSDX/"
  );
  // 地形夸张
  ffCesium.viewer.scene.verticalExaggeration = 3.0;
};

const addWaiwei = async () => {
  let pointList = areaHeightJson.coordinates[0][0];
  let minimumHeightsArr = [];
  let maximumHeightsArr = [];
  for (let i = 0; i < pointList.length; i++) {
    //pointList[i][2] = pointList[i][2] * 3;
    minimumHeightsArr.push(-1000);
    maximumHeightsArr.push(pointList[i][2] * 3);
  }
  console.log("addWaiwei--pointList", pointList);

  ffCesium.viewer.entities.add({
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
      material: Cesium.Color.fromCssColorString("#4ABAE9"),
      minimumHeights: minimumHeightsArr,
      maximumHeights: maximumHeightsArr,
    },
  });

  // for (let i = 0; i < pointList.length; i++) {
  //   pointList[i][2] = pointList[i][2] + 10;
  // }
  // ffCesium.viewer.entities.add({
  //   name: "Red polygon on surface",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
  //     width: 15,
  //     material: Cesium.Color.BLUE,
  //     //clampToGround: true,
  //   },
  // });

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
  });*/

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
