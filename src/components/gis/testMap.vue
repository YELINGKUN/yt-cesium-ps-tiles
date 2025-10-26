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
  <div id="cesiumContainer">
    <pointList v-if="show" :ffCesium="ffCesium"></pointList>
    <!-- <mapList v-if="show" :ffCesium="ffCesium"></mapList> -->
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "../../FFCesium/core/index.js";
import areaHeightJson from "./js/areaHeight.json";
//import areaScale from "./js/areaScale.json";
import * as turf from "@turf/turf";
import areaScaleHeight from "./js/areaScaleHeight.json";
import flicker3 from "./images/flicker2.png";
import PolylineFluid from "./js/PolylineFluid.js";
import polylineEffect30 from "./images/polylineEffect30.png";
import polylineEffect9 from "./images/river105.png";
import * as Cesium from "cesium";
import pointList from "../hook/pointList.vue";
import mapList from "../hook/mapList.vue";

import PolygonEffect from "./js/PolygonEffect.js";

import { zhuju } from "./data/zhuju.js";

let ffCesium = null;
let show = ref(false);
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
  show.value = true;

  ffCesium.addArcgisImgLayer();
  //ffCesium.addTdtImgLayer();

  //调整亮度和gamma值
  ffCesium.viewer.imageryLayers.get(0).gamma = 0.8;
  ffCesium.viewer.imageryLayers.get(0).brightness = 2;

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

  let polygonEffect = new PolygonEffect(ffCesium);
  polygonEffect.addHandler();
  polygonEffect.addPolygon();
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

  //得加河流效果
  addRiverEffect();
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

const addRiverEffect = () => {
  let zhiqu =
    "129.64032724315788,46.64329482296441;129.64161470348506,46.64353052666655;129.6433313172546,46.64276448587978;129.6447046082702,46.642116289049625;129.64573457653194,46.642057361679974;129.64753702098992,46.6422341435964;129.64803054744866,46.64227833898522;129.6484167855468,46.64204262982753;129.64893176967766,46.642027897971076;129.64916780407097,46.64220467998379;129.64931800777578,46.64245512017959;129.64961841518544,46.642646632488294;129.6499188225951,46.642646632488294;129.65047672207024,46.64248458365583;129.6506483834472,46.64238146141881;129.65127065593862,46.64232253433795;129.6514852326598,46.64241092493515;129.65159252102043,46.64263190079632;129.6518929284301,46.64276448587978;129.6522147935119,46.64276448587978;129.65268686229848,46.6428086808354;129.65285852367546,46.642970728697094;129.65294435436394,46.64310331295022;129.65315893108513,46.64311804451381;129.65342715198653,46.64323589687834;129.65378120357653,46.64323589687834;129.65395286495348,46.643346383236974;129.65404942447802,46.64350106375991;129.65424254352706,46.643641012423444;129.65451076442855,46.643641012423444;129.65472534114977,46.64361891529009;129.65490773136278,46.64365574384067;129.65497210437914,46.64377359503388;129.65563729221483,46.64401666230907;129.65600207264083,46.64434075031053;129.65625956470626,46.64450279358317;129.65635612423083,46.64463537408159;129.65655997211593,46.64467220194015;129.65667798931258,46.64477531981075;129.65691402370592,46.644834244219965;129.6571607869353,46.644856340856904;129.65727880413195,46.645011017062586;129.65811565334465,46.64546031210432;129.65856626445915,46.64563708290112;129.6591027062621,46.64585804558479;129.6598966401305,46.64610846886853;129.66041162426137,46.64641781367732;129.66071203167104,46.64643254433835;129.66094806606435,46.64656512010734;129.66124847347402,46.646609311958116;129.66146863116037,46.64679768485064;129.66186559809458,46.64690816393497;129.6619836152912,46.64697445127726;129.6619943441273,46.64707019951709;129.66361267506346,46.64781342281634;129.6643422359155,46.648019646385336;129.6648786777185,46.64837317067446;129.66541511952147,46.64854993195257;129.66575844227538,46.648756152713645;129.66620905338988,46.64896237268846;129.66683132588133,46.64921278160091;129.66749651371703,46.6495073788372;129.66826898991332,46.649743055470964;129.66878397404417,46.6500376498191;129.6707911547014,46.651009043145535;129.67070532401289,46.65215792513743;129.66984701712812,46.65371918718728;129.66924620230878,46.65519203459684;129.66864538748945,46.656517562968645;129.66795874198166,46.657695783133335;129.6678729112932,46.658461612473616;129.6691603716203,46.66014050807246;129.67031908591474,46.66155427445884;129.67109156211106,46.662378954445586;129.67160654624192,46.662791289721724;129.67551184256757,46.66229059647728;129.68090426739866,46.66147394811372;129.68412291821653,46.66117941606089;129.6867836695593,46.661091056132136;129.68940150555784,46.66112050945776;129.69064605054075,46.66206300740589;129.6915043574255,46.66294658431036;129.69257724103147,46.66403630927144;129.69399344739134,46.6647431461499;129.69528090771848,46.665273267743714;129.697898743717,46.66544997378645;129.69841372784788,46.66506710996384;129.70095857602703,46.664169923187785;129.70158084851852,46.66377232436497;129.70145210248577,46.66343362676494;129.7013662717973,46.66316855759786;129.70128044110885,46.66294766563249;129.70168813687908,46.66259423661063;129.7021387479936,46.66221135256296;129.7029112241899,46.66122467732765;129.70411285382858,46.6604736139592;129.70535739881146,46.66025271098289;129.70686206611967,46.66000580927408;129.7081066111026,46.660123624845085;129.70930824074128,46.66047707001778;129.71093902382233,46.66115450014064;129.71188316139558,46.66186137469765;129.71265563759187,46.66289221686017;129.7140289286075,46.664747683221634;129.71407184395173,46.66586682261763;129.71390018257478,46.66651473483614;129.71368560585358,46.66707428913904;129.71390018257478,46.66739823898277;129.71441516670563,46.6676632874109;129.7149301508365,46.667133189255026;129.71540221962312,46.66651473483614;129.71746215614655,46.6650716470084;129.71874961647367,46.66445316900348;129.72003707680085,46.66412920151032;129.72085246834138,46.66374632833353;129.72235450538972,46.66365797260002;129.72338447365144,46.66386413575367;129.72495807278577,46.66394061192355;129.72628844845715,46.66432348372439;129.72714675534192,46.664544370068285;129.72796214688245,46.66483888378957;129.72923698001102,46.665469477328685;129.7298117468267,46.66583446280461;129.73017652725272,46.66623204646095;129.7303696463018,46.66676215345399;129.73090608810477,46.66693885462976;129.73133524154716,46.66693885462976;129.73142107223566,46.66730698022408;129.73165710662894,46.667807627009125;129.7319564291737,46.66839761870989;129.73234266727184,46.66845651738393;129.7334221486947,46.66885860926823;129.7340015058419,46.66902057908601;129.73468815134973,46.66884388471527;129.73631893443078,46.668549392813844;129.73706995295493,46.66853466817665;129.73771368311853,46.66835797221748;129.73874365138025,46.66840214626143;129.73906551646203,46.66868191436805;129.73885093974081,46.66946231248576";
  let zhiquArr = lnglatStrTolnglatArr(zhiqu);
  let option1 = {
    color: "#EBFFE4",
    widthCoefficient: 5,
    imgUrl: polylineEffect30,
    showBackPolyline: true,
    fluidConfig: [
      {
        range: [100000, 20000000],
        times: 1,
        time: 10000,
      },
      {
        range: [50000, 100000],
        times: 2,
        time: 15000,
      },
      {
        range: [20000, 50000],
        times: 3,
        time: 30000,
      },
      {
        range: [5000, 20000],
        times: 4,
        time: 50000,
      },
      {
        range: [2500, 5000],
        times: 5,
        time: 100000,
      },
      {
        range: [0, 2500],
        times: 8,
        time: 150000,
      },
    ],
  };
  let polylineFluidObj1 = new PolylineFluid(ffCesium);
  polylineFluidObj1.addPolylineFluid(zhiquArr, option1);

  //叠加动态线
  // let smallRiverStr1 =
  //   "129.9175703430827,46.67115360803487;129.90914127571804,46.672694819638934;129.90261814339385,46.6743438271383;129.89849827034695,46.678348350158075;129.89815494759304,46.68494338821782;129.89815494759304,46.689418134132666;129.89369175179226,46.69365702517149;129.8851086829446,46.69577634593239;129.8778989051126,46.69671823957344;129.8737790320657,46.69342153995285;129.87103245003445,46.691066631291505;129.86519596321804,46.69177311467155;129.8614194129251,46.69506991492008;129.8521496985696,46.695540869955096;129.8466565345071,46.69624729480657;129.84253666146023,46.6997792804444;129.83429691536648,46.70095655765007;129.82846042855007,46.70095655765007;129.82365390999541,46.6997792804444;129.81781742317898,46.70260470261232;129.81060764534695,46.70401735824913;129.80030796272976,46.70425279726146;129.7965314124368,46.69813104923071;129.79275486214382,46.69412799252828;129.7858884070657,46.69318605370742;129.7790219519876,46.69365702517149;129.77181217415557,46.69412799252828;129.76734897835476,46.688711619947924;129.7642590735696,46.68400128921192;129.76151249153835,46.68046827161527;129.759109232261,46.67622834552611;129.75464603646023,46.67198808673629;129.7474362586282,46.66892547069759;129.73198673470242,46.674108257718984;129.72237369759304,46.681645969818504;129.71550724251492,46.68706305091118;129.70555088265164,46.69059563723741;129.69387790901882,46.68918263043125;129.68941471321807,46.68612098887135;129.6873547766946,46.68211704191194;129.68426487190945,46.676935022978455;129.67980167610867,46.672694819638934;129.671218607261,46.670339007356546;129.66229221565945,46.672930395219424";
  // let smallRiverArr1 = lnglatStrTolnglatArr(smallRiverStr1);

  let option = {
    //color: "#EBFFE4",
    //color: "#00008B",
    color: "#9bb5f5",
    //color: "#3187FF",
    widthCoefficient: 11,
    imgUrl: polylineEffect9,
    showBackPolyline: false,
    fluidConfig: [
      {
        range: [100000, 20000000],
        times: 5,
        time: 20000,
      },
      {
        range: [50000, 100000],
        times: 10,
        time: 15000,
      },
      {
        range: [20000, 50000],
        times: 8,
        time: 30000,
      },
      {
        range: [5000, 20000],
        times: 11,
        time: 50000,
      },
      {
        range: [0, 5000],
        times: 13,
        time: 100000,
      },
    ],
  };
  let polylineFluidObj = new PolylineFluid(ffCesium);
  polylineFluidObj.addPolylineFluid(zhuju.data, option);
};

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
./js/PolygonEffect1.js
