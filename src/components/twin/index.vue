<template>
  <div
    id="fatherDivID"
    class="fatherDivClass"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-image: url('./back/背景3.png');
      background-size: cover;
      background-position: center;
    "
  >
    <!--
    <div class="rotating-background1"></div>
    <div class="rotating-background2"></div>
    <div class="rotating-background3"></div>
    <div class="rotating-background4"></div>
    -->
  </div>
  <div id="cesiumContainer">
    <pointList
      v-if="ispointListFlag"
      :layershow="layershow"
      :ffCesium="ffCesium"
      @LayerShow="LayerShow"
    ></pointList>
    <!-- <mapList v-if="ispointListFlag" :ffCesium="ffCesium"></mapList> -->
    <!-- <addWMS
      :ffCesium="ffCesium"
      v-if="ispointListFlag"
      :layerWMS="layerWMS"
    ></addWMS> -->
    <measurePoint
      v-if="ispointListFlag"
      :ffCesium="ffCesium"
      :showGate="showGate"
    ></measurePoint>
  </div>

  <div style="position: absolute; right: 100px; bottom: 100px; z-index: 9999">
    <el-button type="primary" @click="changeMapType('GIS')">GIS地图</el-button>
    <el-button
      type="primary"
      style="margin-left: 30px"
      @click="changeMapType('Sandbox')"
      >三维沙盘</el-button
    >
  </div>

  <div style="position: absolute; right: 100px; top: 30%; z-index: 9999">
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="toStartRotate()"
        >灌区环视</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="fourColor()"
        >四情预警</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="chargeCount()"
        >收费统计</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="drought()"
        >旱情热力图</el-button
      >
    </div>

    <!-- <div style="padding-top: 30px">
      <el-button size="small" type="primary" @click="drawRiverFluid('point')"
        >支渠流动（点）</el-button
      >
    </div> -->
    <div style="padding-top: 30px">
      <el-button size="small" type="primary" @click="drawRiver"
        >干渠流动（水流）</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button
        size="small"
        v-show="buttonFlag"
        type="primary"
        @click="drawRiverFluid('arrow')"
        >支渠流动（箭头）</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button
        size="small"
        v-show="buttonFlag"
        type="primary"
        @click="drawRiverFluid('twoline')"
        >支渠流动（单线）</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button
        size="small"
        v-show="buttonFlag"
        type="success"
        @click="closeDrawRiverFluid('twoline')"
        >关闭支渠流动</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="changeBack('2')"
        >切换背景2</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="changeBack('3')"
        >切换背景3</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="openGate">开闸</el-button>
    </div>
    <div style="position: absolute; right: -70px; top: 0%; z-index: 9999">
      <div v-for="i in layershow" :key="i.name">
        <div style="padding-top: 10px">
          <el-button
            size="small"
            type="primary"
            @click="showZhakong(layershow, i.name)"
            >{{ i.name }}</el-button
          >
        </div>
      </div>
    </div>

    <div style="padding-top: 30px">
      <el-button size="small" type="primary" @click="FlyRoam()"
        >开始漫游</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="pauseFly()"
        >暂停漫游</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="continueFly()"
        >继续漫游</el-button
      >
    </div>
    <div style="padding-top: 10px">
      <el-button size="small" type="primary" @click="stopFly()"
        >停止漫游</el-button
      >
    </div>

    <!--
    <div style="position: absolute; right: 23px; top: -55%; z-index: 9999">
      <div v-for="i in layerWMS" :key="i.name">
        <div style="padding-top: 10px">
          <el-button
            size="small"
            type="primary"
            @click="showZhakong(layerWMS, i.name)"
            >{{ i.name }}</el-button
          >
        </div>
      </div>
    </div>
    -->
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as Cesium from "cesium";

import _ from "lodash";

import MapCroppingClass from "./myjs/MapCroppingClass.js";
import PolygonEffect from "./myjs/PolygonEffect.js";
import PolylineEffect from "./myjs/PolylineEffect.js";
import RiverEffectClass from "./myjs/RiverEffectClass.js";

import WmsClass from "./myjs/WmsClass.js";
//业务js代码
import { initMap, destroyMap } from "./myjs/initMap.js";

//河流数据
import canalData from "./data/canal4.json";
import * as turf from "@turf/turf";
import polylineEffect30 from "./images/oneArrow80.png";
import polylineEffect9 from "./images/riverlight40.png";
//地图旋转
import Rotate from "./myjs/Rotate.js";
//其他方法
import OtherClass from "./myjs/OtherClass.js";

//小欧组件
import pointList from "./components/pointList.vue";
import mapList from "./components/mapList/index.vue";
import measurePoint from "./components/measurePoint/index.vue";
import addWMS from "./components/addWMS/index.vue";

//旱情热力图相关
import hqData from "./data/hqjcd.json";
import { HeatMap } from "./myjs/hotMap.js";

let ffCesium = null;
let ispointListFlag = ref(false);
let showGate = ref(false);
let layerWMS = ref([
  {
    name: "地块图",
    show: true,
    data: "sl:dk",
  },
  {
    name: "渠系图",
    show: true,
    data: "sl:qx",
  },
  {
    name: "汤原县边界图",
    show: true,
    data: "sl:tyxbj",
  },
  {
    name: "佳木斯水系",
    show: true,
    data: "sl:jmssx",
  },
]);
let layershow = ref([
  {
    name: "工程点",
    show: true,
  },
  {
    name: "闸控点",
    show: true,
  },
  // {
  //   name: "线",
  //   show: false,
  // },
  // {
  //   name: "面",
  //   show: false,
  // },
  {
    name: "视频点",
    show: false,
  },
  {
    name: "水情点",
    show: false,
  },
]);
const LayerShow = (value) => {
  console.log("mian子来的值", value);
  layershow.value = value;
};

const changeBack = (type) => {
  if (type == "2") {
    document.getElementById("fatherDivID").style.backgroundImage =
      "url('./back/背景2.png')";
  }
  if (type == "3") {
    console.log("切换背景3");
    document.getElementById("fatherDivID").style.backgroundImage =
      "url('./back/背景3.png')";
  }
};

onMounted(() => {
  changeMapType("GIS");
  //changeMapType("Sandbox");
});

//let
const getRiverImage = () => {
  ffCesium.timesBranchImage = {};
  ffCesium.timesCanalImage = {};
  for (let i = 0; i < canalData.features.length; i++) {
    let feature = canalData.features[i];
    var length = turf.length(feature, { units: "meters" });
    let times = length / 1000;
    if (feature.properties.layer.indexOf("干渠") >= 0) {
      times = 1;
      startCopyImage("canal", Math.ceil(times));
      startCopyImage("canal", Math.ceil(times * 1.2));
      startCopyImage("canal", Math.ceil(times * 1.5));
      startCopyImage("canal", Math.ceil(times * 2));
    } else {
      startCopyImage("branch", Math.ceil(times / 3));
      startCopyImage("branch", Math.ceil(times * 1.5));
      startCopyImage("branch", Math.ceil(times * 2));
      startCopyImage("branch", Math.ceil(times * 2.5));
      startCopyImage("branch", Math.ceil(times * 3));
      startCopyImage("branch", Math.ceil(times * 5));
    }
  }
  console.log("ffCesium", ffCesium);
};

const startCopyImage = (type, times) => {
  if (type == "canal") {
    copyImagesTime(polylineEffect9, times).then((mergedBase64) => {
      if (!ffCesium.timesCanalImage[times]) {
        ffCesium.timesCanalImage[times] = mergedBase64;
      }
    });
  } else {
    copyImagesTime(polylineEffect30, times).then((mergedBase64) => {
      if (!ffCesium.timesBranchImage[times]) {
        ffCesium.timesBranchImage[times] = mergedBase64;
      }
    });
  }
};

const copyImagesTime = async (base64Image, num) => {
  return new Promise((resolve, reject) => {
    function createImage(base64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          //console.log(`Loaded image with size: ${img.width}x${img.height}`);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
          reject(error);
        };
        img.src = base64;
      });
    }
    let arrTemp = [];
    for (let i = 0; i < num; i++) {
      arrTemp.push(createImage(base64Image));
    }

    Promise.all(arrTemp)
      .then((arr) => {
        //console.log("arr", arr);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // canvas.width = Math.max(img1.width, img2.width);
        // canvas.height = img1.height + img2.height;

        canvas.width = arr[0].width * num;
        canvas.height = arr[0].height;

        ctx.drawImage(arr[0], 0, 0);

        for (let i = 1; i < num; i++) {
          ctx.drawImage(arr[0], arr[0].width * i, 0);
        }
        const mergedBase64 = canvas.toDataURL("image/png");
        resolve(mergedBase64);
      })
      .catch((error) => {
        console.error("Error merging images:", error);
        reject(error);
      });
  });
};

//地图旋转
let rotateFlag = false;
let rotateObj = null;
const toStartRotate = () => {
  console.log("rotateFlag", rotateFlag);
  if (rotateFlag == false) {
    rotateObj.StartRotate();
    rotateFlag = true;
  } else {
    rotateObj.StopRotate();
    rotateFlag = false;
  }
};

const fourColor = () => {
  alert("切换到水资源配置与调度模块！");
};

const chargeCount = () => {
  alert("功能未开发");
};

let hotMap;
const drought = () => {
  if (hotMap == null) {
    //创建热力图
    hotMap = new HeatMap(ffCesium.viewer);
    hotMap.addHeatMapForGeoJson(hqData, "value", true);
  } else {
    hotMap.destroy(); //销毁热力图
    hotMap = null;
  }
};

let polylineEffectObj = null;
const showZhakong = (data, name) => {
  data.map((node) => {
    if (name == node.name) {
      node.show = !node.show;
    }
  });
};
const openGate = () => {
  showGate.value = !showGate.value;
};

const drawRiverFluid = (type) => {
  if (type == "point") {
    polylineEffectObj.addPoint();
  } else if (type == "arrow") {
    polylineEffectObj.addArrow();
  } else if (type == "twoline") {
    polylineEffectObj.addTwoLine();
  }
};

const closeDrawRiverFluid = () => {
  polylineEffectObj.deleteTwoLine();
  polylineEffectObj.deletePoint();
  polylineEffectObj.deleteArrow();
};

let drawRiverFlag = false;
//渠道走向模拟
const drawRiver = () => {
  //渠道走向模拟
  // let riverEffectClass = new RiverEffectClass(ffCesium);
  // riverEffectClass.addRiverEffect();
  if (drawRiverFlag == false) {
    //叠加干渠
    polylineEffectObj.addCanal();
    //叠加支渠
    //drawRiverFluid("twoline");
    drawRiverFlag = true;
  } else {
    polylineEffectObj.deleteMainCanalPolylineFluid();
    drawRiverFlag = false;
  }
};

// let abc = null;
// const addMap = () => {
//   nextTick(() => {
//     abc = ffCesium.addTdtVecLayer();
//   });
// };

// window.setTimeout(() => {
//   console.log("10");
//   ffCesium.removeMapLayer(abc);
// }, 5000);

//改变地图类型 GIS,Sandbox

let otherClass = null;
let wmsClass = null;
const buttonFlag = ref(false);
const changeMapType = (mapType) => {
  let the = this;
  drawRiverFlag = false;
  rotateFlag = false;
  ispointListFlag.value = false;
  if (ffCesium != null) {
    destroyMap(ffCesium);
    ffCesium = null;
  }

  nextTick(() => {
    ffCesium = initMap();
    otherClass = new OtherClass(ffCesium);
    rotateObj = new Rotate(ffCesium);
    polylineEffectObj = new PolylineEffect(ffCesium);
    if (mapType == "Sandbox") {
      //裁剪区域
      let mapCroppingClass = new MapCroppingClass(ffCesium);
      mapCroppingClass.mapCropping();
      //叠加面
      let polygonEffectObj = new PolygonEffect(ffCesium);
      console.log("polygonEffectObj1111", polygonEffectObj);
      //叠加地块
      //polygonEffectObj.addMassif();
      //叠加点
      ispointListFlag.value = true;
    } else if (mapType == "GIS") {
      //叠加点
      ispointListFlag.value = true;
      //叠加辖区边界
      otherClass.addXiaQUBoundary();
    }
    //点击地图获取坐标
    otherClass.addClickHandlerForGetXY();

    wmsClass = new WmsClass(ffCesium);
    wmsClass.addDefaultWMS();

    //获取河流图片
    // getRiverImage();
    // window.setTimeout(() => {
    //   //timesCanalImage,timesBranchImage
    //   let jsonStr = JSON.stringify(ffCesium.timesCanalImage);
    //   console.log("timesCanalImage1234", jsonStr);
    // }, 10000);

    //高度监听

    let handler = new Cesium.ScreenSpaceEventHandler(
      ffCesium.viewer.scene.canvas
    );
    handler.setInputAction((wheelment) => {
      var height = ffCesium.viewer.camera.positionCartographic.height;
      if (height < 50000) {
        buttonFlag.value = true;
      } else {
        buttonFlag.value = false;
      }
    }, Cesium.ScreenSpaceEventType.WHEEL);

    var riverHandle = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // 对鼠标按下事件的监听
    riverHandle.setInputAction(function (event) {
      //获取加载地形后对应的经纬度和高程：地标坐标
      var ray = viewer.camera.getPickRay(event.position);
      var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        // 转换为经纬度
        const cartographic =
          viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        const height = viewer.scene.globe.getHeight(cartographic);
        // 输出点击的经纬度和高度
        console.log("采集坐标：" + longitudeString + "," + latitudeString);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  });
};

const FlyRoam = () => {
  let lnglatArr = [];
  for (let i = 0; i < canalData.features.length; i++) {
    let feature = canalData.features[i];
    if (feature.properties.Name == "引汤总干渠4") {
      console.log("FlyRoam--feature", feature);
      lnglatArr = _.cloneDeep(feature.geometry.coordinates);
    }
  }
  for (let i = 0; i < lnglatArr.length; i++) {
    lnglatArr[i][2] = lnglatArr[i][2] + 100;
  }
  console.log("FlyRoam--lnglatArr", lnglatArr);
  console.log("FlyRoam--ffCesium", ffCesium);

  //初始化飞行漫游
  ffCesium.flyRoam.init();
  let option = {};
  option.interpolationType = "3"; //1：直线段；2、微弯曲线；3、弧线
  option.interpolationCount = 1000; //插值点数
  option.showPointFlag = false;
  option.lnglatArr = lnglatArr;
  option.speed = 2;
  ffCesium.flyRoam.createFlyLine(option);
  /** 
  let polylineOption = {
    width: 5,
    color: "#FFFF00",
    alpha: 1,
  };
  let polylineEntity = ffCesium.addPolylineEntity(lnglatArr, polylineOption);
*/
  let startPoint = lnglatArr[0];
  let optionTemp = {
    lng: startPoint[0],
    lat: startPoint[1],
    eyeHeight: startPoint[2],
    pitchRadiu: -10,
    time: 2,
  };
  ffCesium.flyTo(optionTemp, callback);
};
const callback = () => {
  /**  */
  ffCesium.flyRoam.startFly(1, (index, position) => {
    console.log("index, position", index, position);
    if (index == 1) {
    } else if (index == 2) {
    }
  });
};

const pauseFly = () => {
  ffCesium.flyRoam.pauseFly();
};

const continueFly = () => {
  ffCesium.flyRoam.continueFly();
};

const stopFly = () => {
  ffCesium.flyRoam.stopFly();
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
  background-image: url("./back/右转外圈.png");
  /* 替换为你的图片路径 */
  background-size: cover;
  /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 800px;
  /* 根据需要设置宽度 */
  height: 800px;
  /* 根据需要设置高度 */
  /* 其他样式 */
}

.rotating-background2 {
  position: absolute;
  animation: rotateBackground infinite 20s linear;
  background-image: url("./back/右转中大圈.png");
  /* 替换为你的图片路径 */
  background-size: cover;
  /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 700px;
  /* 根据需要设置宽度 */
  height: 700px;
  /* 根据需要设置高度 */
  /* 其他样式 */
}

.rotating-background3 {
  position: absolute;
  animation: rotateBackgroundContrary infinite 20s linear;
  background-image: url("./back/左转中圈.png");
  /* 替换为你的图片路径 */
  background-size: cover;
  /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 600px;
  /* 根据需要设置宽度 */
  height: 600px;
  /* 根据需要设置高度 */
  /* 其他样式 */
}

.rotating-background4 {
  position: absolute;
  animation: rotateBackground infinite 10s linear;
  background-image: url("./back/右转小圈.png");
  /* 替换为你的图片路径 */
  background-size: cover;
  /* 或者其他你需要的大小设置 */
  background-position: center;
  width: 500px;
  /* 根据需要设置宽度 */
  height: 500px;
  /* 根据需要设置高度 */
  /* 其他样式 */
}
</style>
