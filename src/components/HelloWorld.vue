<template>
  <div id="cesiumContainer">
    <!-- <Vdemo :ffCesium="ffCesium"></Vdemo> -->
    <mapList :ffCesium="ffCesium"></mapList>
    <!-- <panorama :show="show" :urlImg="urlImg" @setShow="setShow"></panorama> -->
    <pointList :ffCesium="ffCesium"></pointList>
    <!-- <div class="showCanvas" :class="{ offCanvas: show }" id="viewer">
      <div class="off" @click="offCanvas">关闭</div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import mapList from "./hook/mapList.vue";
import pointList from "./hook/pointList.vue";
// import Vdemo from "./hook/demo.vue";
// import FFCesium from "../FFCesium/core";
import FFCesium from "./twin/FFCesium/core";
let show = ref(false);
let urlImg = ref();
let ffCesium = ref();
onMounted(() => {
  init();
});
function init() {
  let viewerOption = {
    animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    baseLayer: false,
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
  }; //初始化
  // debugger;
  ffCesium.value = new FFCesium("cesiumContainer", viewerOption);
  console.log("2222", ffCesium);

  //是否开启抗锯齿
  ffCesium.value.viewer.scene.fxaa = true;
  ffCesium.value.viewer.scene.postProcessStages.fxaa.enabled = true;

  ffCesium.value.addTdtImgLayer(); //初始化地球
  ffCesium.value.addTerrain("http://data.marsgis.cn/terrain");
  ffCesium.value.setView({
    lng: 129.85897571573392,
    lat: 46.62706812460703,
    height: 8000,
    pitchRadiu: -40,
  });
  ffCesium.value.getClickModel(callback, function name() { });
}
const setShow = (value) => {
  show.value = value;
};

const callback = (model) => {
  console.log("model", model);
  if (model.id && model.id.billboard) {
    if (model.id.type == "panorama") {
      show.value = true;
      urlImg.value = model.id.layer.url;
    } else {
      // let optionfly = {
      //   lng: model.id.FFCoordinates[0],
      //   lat: model.id.FFCoordinates[1] - 0.026,
      //   height: 6000,
      //   distance: 1700,
      //   pitchRadiu: -50,
      //   time: 2,
      // };
      // ffCesium.value.flyTo(optionfly);
    }
  }
};
</script>
<style lang="scss" scoped>
#cesiumContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
