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

import flickerBase64 from "./images/flicker2.png";
import PolylineFlow from "./js/polylineFlow.js";

//import polylineEffect9 from "./images/polylineEffect9.png";
//import polylineEffect9 from "./images/river.png";

//import polylineEffect9 from "./images/polylineEffect20.png";
//import polylineEffect9 from "./images/polylineEffect21.png";
import polylineEffect9 from "./images/polylineEffect22.png";

//import polylineEffect9 from "./images/polylineEffect2.png";

import polylineEffect30 from "./images/polylineEffect30.png";

let imagebase64 = ref("");

var mapOption = {
  //url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  url: "http://112.48.26.30:24518/tdt/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa", //高德地图
};
var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);

let viewer = null;

let songhuajiangStr =
  "130.25461155821515,46.81925403799818;130.2140994732542,46.81690462185617;130.16878086973858,46.82536203954754;130.12895543028546,46.8248922179113;130.10286290098858,46.817374513296954;130.09393650938702,46.80280596923842;130.09736973692608,46.79199449943988;130.10560948301983,46.77788931770746;130.11316258360577,46.768954124358146;130.1145358746214,46.75860625892068;130.10148960997296,46.75202021875495;130.08089024473858,46.74919738370721;130.06990391661358,46.7571950323605;130.0596042339964,46.76378044009243;130.03694493223858,46.77083534089235;130.01771885801986,46.772716491720985;130.0115390484495,46.768954124358146;129.9998660748167,46.76754316883802;129.97858006407452,46.7694244346516;129.9614139263792,46.762369349053046;129.9614139263792,46.751549756513896;129.96278721739483,46.72755073655517;129.94836766173077,46.69459351207806;129.91884190489483,46.675751776491495;129.9167819683714,46.654075656074866;129.91403538634015,46.63474830980937;129.90991551329327,46.62390311665882;129.89892918516827,46.60975394680267;129.87146336485577,46.59937553915901";

let smallRiverStr1 =
  "129.9175703430827,46.67115360803487;129.90914127571804,46.672694819638934;129.90261814339385,46.6743438271383;129.89849827034695,46.678348350158075;129.89815494759304,46.68494338821782;129.89815494759304,46.689418134132666;129.89369175179226,46.69365702517149;129.8851086829446,46.69577634593239;129.8778989051126,46.69671823957344;129.8737790320657,46.69342153995285;129.87103245003445,46.691066631291505;129.86519596321804,46.69177311467155;129.8614194129251,46.69506991492008;129.8521496985696,46.695540869955096;129.8466565345071,46.69624729480657;129.84253666146023,46.6997792804444;129.83429691536648,46.70095655765007;129.82846042855007,46.70095655765007;129.82365390999541,46.6997792804444;129.81781742317898,46.70260470261232;129.81060764534695,46.70401735824913;129.80030796272976,46.70425279726146;129.7965314124368,46.69813104923071;129.79275486214382,46.69412799252828;129.7858884070657,46.69318605370742;129.7790219519876,46.69365702517149;129.77181217415557,46.69412799252828;129.76734897835476,46.688711619947924;129.7642590735696,46.68400128921192;129.76151249153835,46.68046827161527;129.759109232261,46.67622834552611;129.75464603646023,46.67198808673629;129.7474362586282,46.66892547069759;129.73198673470242,46.674108257718984;129.72237369759304,46.681645969818504;129.71550724251492,46.68706305091118;129.70555088265164,46.69059563723741;129.69387790901882,46.68918263043125;129.68941471321807,46.68612098887135;129.6873547766946,46.68211704191194;129.68426487190945,46.676935022978455;129.67980167610867,46.672694819638934;129.671218607261,46.670339007356546;129.66229221565945,46.672930395219424";

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
let smallRiverArr1 = lnglatStrTolnglatArr(smallRiverStr1);

let timesValue3 = 3;
let timeValue3 = 5000;
let timesValue4 = 5;
let timeValue4 = 1000;
let configTemp3 = [
  {
    range: [50000, 20000000],
    times: 1,
    time: 5000,
  },
  {
    range: [20000, 50000],
    times: 2,
    time: 5000,
  },
  {
    range: [5000, 20000],
    times: 5,
    time: 10000,
  },
  {
    range: [0, 5000],
    times: 10,
    time: 20000,
  },
];

let configTemp4 = [
  {
    range: [50000, 20000000],
    times: 3,
    time: 15000,
  },
  {
    range: [20000, 50000],
    times: 5,
    time: 30000,
  },
  {
    range: [5000, 20000],
    times: 8,
    time: 50000,
  },
  {
    range: [0, 5000],
    times: 15,
    time: 100000,
  },
];

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

  //   mergeBase64Images(polylineEffect8, polylineEffect8).then((mergedBase64) => {
  //     console.log("mergeBase64Images", mergedBase64); // 输出合并后的Base64编码的图片
  //     imagebase64.value = mergedBase64;
  //     addEntity(mergedBase64);
  //   });

  copyImagesTime(polylineEffect9, timesValue3).then((mergedBase64) => {
    console.log("mergeBase64Images", mergedBase64); // 输出合并后的Base64编码的图片
    imagebase64.value = mergedBase64;
    //addEntity3(mergedBase64);
  });

  copyImagesTime(polylineEffect30, timesValue4).then((mergedBase64) => {
    console.log("mergeBase64Images", mergedBase64); // 输出合并后的Base64编码的图片
    imagebase64.value = mergedBase64;
    addEntity4(mergedBase64);
  });

  heightMonitor();
});

let polylineObj3 = null;
let polylineObj4 = null;

const addEntity4 = (mergedBase64) => {
  let option4 = {
    width: new Cesium.CallbackProperty(function (time, result) {
      // 获取相机的当前位置
      var height = viewer.camera.positionCartographic.height;
      // 根据距离计算宽度
      result = 10 + 100000 / height; // 这里假设宽度与距离成反比，距离越大，宽度越小
      //console.log("目前宽度：", result);
      if (result > 100) {
        result = 100;
      }
      return result;
    }, false),
    color: "#EBFFE4",
    url: mergedBase64,
    time: getTime(smallRiverArr1, timeValue4),
  };
  polylineObj4 = addPolylineFlow(smallRiverArr1, option4);

  let option2 = {
    width: new Cesium.CallbackProperty(function (time, result) {
      // 获取相机的当前位置
      var height = viewer.camera.positionCartographic.height;
      // 根据距离计算宽度
      result = 40 + 100000 / height; // 这里假设宽度与距离成反比，距离越大，宽度越小
      //console.log("目前宽度：", result);
      if (result > 150) {
        result = 150;
      }
      return result;
    }, false),
    color: "#EBFFE4",
    alpha: 1,
    clampToGround: true,
  };
  addPolylineFlickerByEntity(smallRiverArr1, option2);
};

const addEntity3 = (mergedBase64) => {
  let option3 = {
    width: new Cesium.CallbackProperty(function (time, result) {
      // 获取相机的当前位置
      var height = viewer.camera.positionCartographic.height;
      // 根据距离计算宽度
      result = 30 + 150000 / height; // 这里假设宽度与距离成反比，距离越大，宽度越小
      //console.log("目前宽度：", result);
      if (result > 250) {
        result = 250;
      }
      return result;
    }, false),
    color: "#B4E0F6",
    url: mergedBase64,
    time: getTime(songhuajiangData, timeValue3),
  };
  polylineObj3 = addPolylineFlow(songhuajiangData, option3);

  let option1 = {
    width: 80,
    //color: "#B4E0F6",
    alpha: 1,
  };
  let polylinePrimitive = addPolylineFlickerByEntity(songhuajiangData, option1);
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

//添加闪烁线
const addPolylineFlickerByEntity = (lnglatArr, option) => {
  let FFentity = viewer.entities.add({
    show: true,
    polyline: {
      clampToGround: true,
      positions: Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat()),
      width: 5,
      material: Cesium.Color.fromCssColorString(option.color),
    },
  });
  FFentity.flickerFlag = 1;
  FFentity.flickerChangeFlag = "minus";
  FFentity.polyline = {
    clampToGround: true,
    positions: FFentity.polyline.positions,
    width: option.width,
    material: new Cesium.ImageMaterialProperty({
      image: flickerBase64,
      color: new Cesium.CallbackProperty(function () {
        // if (FFentity.flickerChangeFlag == "plus") {
        //   FFentity.flickerFlag = FFentity.flickerFlag + 0.02;
        //   if (FFentity.flickerFlag > 1) {
        //     FFentity.flickerChangeFlag = "minus";
        //   }
        // } else if (FFentity.flickerChangeFlag == "minus") {
        //   FFentity.flickerFlag = FFentity.flickerFlag - 0.02;
        //   if (FFentity.flickerFlag < 0.3) {
        //     FFentity.flickerChangeFlag = "plus";
        //   }
        // }
        // return Cesium.Color.fromCssColorString(option.color).withAlpha(
        //   FFentity.flickerFlag
        // );

        return Cesium.Color.fromCssColorString(option.color).withAlpha(0.8);
      }, false),
      repeat: new Cesium.Cartesian2(1.0, 1.0),
      transparent: true,
    }),
  };
  FFentity.addType = option.addType;
  return FFentity;
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

/* 获取camera中心点坐标 */
const heightMonitor = () => {
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((wheelment) => {
    var height = viewer.camera.positionCartographic.height;
    console.log("目前高度：", height);
    let timesFlag3 = 0;
    let timeFalg3 = 0;
    for (let i = 0; i < configTemp3.length; i++) {
      if (
        height >= configTemp3[i].range[0] &&
        height <= configTemp3[i].range[1]
      ) {
        timesFlag3 = configTemp3[i].times;
        timeFalg3 = configTemp3[i].time;
      }
    }
    if (timesValue3 != timesFlag3) {
      timesValue3 = timesFlag3;
      copyImagesTime(polylineEffect9, timesValue3).then((mergedBase64) => {
        console.log("合并次数", timesValue3);
        imagebase64.value = mergedBase64;
        let polygonFlowObj = new PolylineFlow(
          Cesium.Color.fromCssColorString("#B4E0F6"),
          mergedBase64,
          timeFalg3
        );
        polylineObj3.polyline.material = polygonFlowObj;
      });
    }

    let timesFlag4 = 0;
    let timeFlag4 = 0;
    for (let i = 0; i < configTemp4.length; i++) {
      if (
        height >= configTemp4[i].range[0] &&
        height <= configTemp4[i].range[1]
      ) {
        timesFlag4 = configTemp4[i].times;
        timeFlag4 = configTemp4[i].time;
      }
    }
    if (timesValue4 != timesFlag4) {
      timesValue4 = timesFlag4;
      copyImagesTime(polylineEffect30, timesValue4).then((mergedBase64) => {
        console.log("合并次数", timesValue4);
        console.log("时间", timeFlag4);
        imagebase64.value = mergedBase64;
        let polygonFlowObj4 = new PolylineFlow(
          Cesium.Color.fromCssColorString("#EBFFE4"),
          mergedBase64,
          timeFlag4
        );
        polylineObj4.polyline.material = polygonFlowObj4;
      });
    }
  }, Cesium.ScreenSpaceEventType.WHEEL);
};
</script>

<style scoped>
#cesiumViewer {
  width: 100%;
  height: 100%;
}
</style>
