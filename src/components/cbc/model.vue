<template>
  <div id="cesiumContainer">
    <div class="tools">
      <!-- <button class="bt_normal" @click="start()">开始编辑</button> -->
      <button class="bt_normal" @click="distance()">平移</button>
      <!-- <button class="bt_normal" @click="rotation()">旋转</button> -->
      <button class="bt_normal" @click="destroy()">关闭编辑</button>
    </div>
  </div>
</template>
<script>
import * as Cesium from "cesium";
let viewer = undefined;
let gltf = undefined;
let editObj = undefined;
import EditGltf from "./js/EditGltf4Entity";
export default {
  data() {
    return {};
  },
  mounted() {
    let key =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDhhOThhNy0zMzUzLTRiZDktYWM3Ni00NGI5MGY2N2UwZDUiLCJpZCI6MjQzMjYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODUwMzUwNDh9.DYuDF_RPKe5_8w849_y-sutM68LM51O9o3bTt_3rF1w";
    Cesium.Ion.defaultAccessToken = key;
    window.viewer = viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
      // terrainProvider: Cesium.createWorldTerrain(),
      geocoder: true,
      homeButton: true,
      sceneModePicker: true,
      baseLayerPicker: true,
      navigationHelpButton: true,
      animation: true,
      timeline: true,
      fullscreenButton: true,
      vrButton: true,
      //关闭点选出现的提示框
      selectionIndicator: false,
      infoBox: false,
    });
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

    this.initdata();
  },
  methods: {
    initdata() {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          130.12461155821515,
          46.69925403799818,
          5500
        ),
        orientation: {
          // 指向
          heading: Cesium.Math.toRadians(0),
          // 视角
          pitch: Cesium.Math.toRadians(-60),
          roll: 0.0,
        },
      });

      const position = Cesium.Cartesian3.fromDegrees(
        130.12461155821515,
        46.71925403799818,
        100
      );
      let heading = Cesium.Math.toRadians(0);
      //弧度的螺距分量。
      let pitch = 0;
      //滚动分量（以弧度为单位）
      let roll = 0;
      //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );

      gltf = viewer.entities.add({
        name: "Gltf模型Entity形式",
        position: position,
        orientation: orientation,
        model: {
          uri: "./model/DracoCompressed/CesiumMilkTruck.gltf",
          scale: 200,
        },
      });
      //viewer.flyTo(viewer.entities);
    },
    start() {
      console.log("待编辑的对象", gltf);
    },
    distance() {
      if (!editObj) {
        editObj = new EditGltf(viewer, gltf, 1, 1);
      }
      editObj && editObj.editTranslation();
    },
    rotation() {
      if (!editObj) {
        editObj = new EditGltf(viewer, gltf, 1, 1);
      }
      editObj && editObj.editRtation();
    },
    destroy() {
      editObj && editObj.destroy();
      editObj = null;
    },
    getLocation() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function (event) {
        let earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
          let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
          let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
          let height = cartographic.height.toFixed(2);
          console.log(earthPosition, {
            lon: lon,
            lat: lat,
            height: height,
          });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
  },
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .tools {
    position: absolute;
    margin: 10px;
    padding: 10px;
    z-index: 10;
  }
}
</style>
