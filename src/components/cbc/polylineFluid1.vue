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
//import polylineEffect9 from "./images/polylineEffect9.png";
//import polylineEffect9 from "./images/river.png";

//import polylineEffect9 from "./images/polylineEffect20.png";

import polylineEffect9 from "./images/polylineEffect2.png";

let imagebase64 = ref("");

var mapOption = {
  //url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  url: "http://112.48.26.30:24518/tdt/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa", //高德地图
};
var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);

let viewer = null;

let songhuajiangStr =
  "130.25461155821515,46.81925403799818;130.2140994732542,46.81690462185617;130.16878086973858,46.82536203954754;130.12895543028546,46.8248922179113;130.10286290098858,46.817374513296954;130.09393650938702,46.80280596923842;130.09736973692608,46.79199449943988;130.10560948301983,46.77788931770746;130.11316258360577,46.768954124358146;130.1145358746214,46.75860625892068;130.10148960997296,46.75202021875495;130.08089024473858,46.74919738370721;130.06990391661358,46.7571950323605;130.0596042339964,46.76378044009243;130.03694493223858,46.77083534089235;130.01771885801986,46.772716491720985;130.0115390484495,46.768954124358146;129.9998660748167,46.76754316883802;129.97858006407452,46.7694244346516;129.9614139263792,46.762369349053046;129.9614139263792,46.751549756513896;129.96278721739483,46.72755073655517;129.94836766173077,46.69459351207806;129.91884190489483,46.675751776491495;129.9167819683714,46.654075656074866;129.91403538634015,46.63474830980937;129.90991551329327,46.62390311665882;129.89892918516827,46.60975394680267;129.87146336485577,46.59937553915901";

const lnglatStrTolnglatArr = (lnglatStr) => {
  let arrTemp = lnglatStr.split(";");
  let lnglatArr = [];
  for (let i = 0; i < arrTemp.length; i++) {
    let arr = arrTemp[i].split(",");
    arr[0] = parseFloat(arr[0]);
    arr[1] = parseFloat(arr[1]);
    //arr[2] = 100;
    lnglatArr.push(arr);
  }
  return lnglatArr;
};

let songhuajiangData = lnglatStrTolnglatArr(songhuajiangStr);

let timesValue = 2;
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
  addEntity(polylineEffect9);
});

let polylineObj3 = null;

const addEntity = (mergedBase64) => {
  let option3 = {
    width: 20,
    color: "#FFFF00",
    url: mergedBase64,
    time: getTime(songhuajiangData, 10000),
  };
  polylineObj3 = addPolylineFlow(songhuajiangData, option3);
};

const getTime = (lnglatArr1, speed) => {
  let lengthLngLatArr1 = [];
  lnglatArr1.forEach((item) => {
    lengthLngLatArr1.push([item[0], item[1]]);
  });
  var line1 = turf.lineString(lengthLngLatArr1);
  var length1 = turf.length(line1, { units: "meters" });
  let time1 = (length1 / speed) * 1000;
  console.log("time1", time1);
  //time1 = 3000;
  return time1;
};

const addPolylineFlow = (lnglatArr, option) => {
  console.log("lnglatArr, option", lnglatArr, option);
  let polygonFlowObj = new PolylineFlow(
    Cesium.Color.fromCssColorString(option.color),
    option.url,
    option.time
  );

  let polylineObj = viewer.entities.add({
    polyline: {
      clampToGround: true,
      positions: Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat()),
      width: option.width,
      material: polygonFlowObj,
    },
  });
  return polylineObj;
};

const copyImagesTime = (base64Image1, num) => {
  return new Promise((resolve, reject) => {
    function createImage(base64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Loaded image with size: ${img.width}x${img.height}`);
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
      arrTemp.push(createImage(base64Image1));
    }

    Promise.all(arrTemp)
      .then((arr) => {
        console.log("arr", arr);
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

const mergeBase64Images = (base64Image1, base64Image2) => {
  return new Promise((resolve, reject) => {
    function createImage(base64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Loaded image with size: ${img.width}x${img.height}`);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
          reject(error);
        };
        img.src = base64;
      });
    }

    Promise.all([createImage(base64Image1), createImage(base64Image2)])
      .then(([img1, img2]) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 确保图片尺寸有效
        if (img1.width === 0 || img1.height === 0) {
          throw new Error("First image has invalid dimensions");
        }
        if (img2.width === 0 || img2.height === 0) {
          throw new Error("Second image has invalid dimensions");
        }

        // canvas.width = Math.max(img1.width, img2.width);
        // canvas.height = img1.height + img2.height;

        canvas.width = img1.width + img2.width;
        canvas.height = Math.max(img1.height, img2.height);

        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.width, 0);

        const mergedBase64 = canvas.toDataURL("image/png");
        resolve(mergedBase64);
      })
      .catch((error) => {
        console.error("Error merging images:", error);
        reject(error);
      });
  });
};
</script>

<style scoped>
#cesiumViewer {
  width: 100%;
  height: 100%;
}
</style>
