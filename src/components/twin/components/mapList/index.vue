<template>
  <div class="popBox">
    <div
      style="
        width: 300px;
        height: 100%;
        background-color: #11253e;
        z-index: 999;
      "
    >
      <div
        style="
          font-family: SourceHanSansSC-Bold;
          font-size: 14px;
          color: #ffffff;
          text-align: left;
          line-height: 22px;
          font-weight: 700;
          padding-top: 8px;
          padding-left: 8px;
          padding-bottom: 8px;
        "
      >
        <img
          style="width: 16px; height: 16px; padding-top: 5px"
          src="./image/标题.svg"
        />
        图层列表
      </div>

      <div
        style="
          padding: 16px;
          background-color: #001129;
          height: calc(100% - 86px);
        "
      >
        <div v-for="(item, index) in allListArr">
          <div
            style="
              background-color: #11253e;
              border: 1px solid #001129;
              height: 100%;
              margin-bottom: 8px;
            "
          >
            <div
              style="
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                padding-right: 8px;
              "
            >
              <el-checkbox
                style="padding-left: 10px"
                v-model="item.checkAll"
                :indeterminate="item.isIndeterminate"
                @change="handleCheckAllChange($event, item)"
              >
                {{ item.name }}
              </el-checkbox>
              <div @click="changeExpend(item)">
                <img
                  v-if="!item.expanded"
                  style="cursor: pointer; width: 16px; height: 16px"
                  src="./image/下.svg"
                />
                <img
                  v-if="item.expanded"
                  style="cursor: pointer; width: 16px; height: 16px"
                  src="./image/上.svg"
                />
              </div>
            </div>

            <div
              style="padding-left: 32px"
              v-show="item.expanded"
              v-for="layer in item.data"
            >
              <div v-show="layer.showFlag">
                <el-checkbox
                  @change="handleCheckChange($event, layer, item)"
                  v-model="layer.checked"
                  :key="layer.id"
                  :label="layer.name"
                  :value="layer.id"
                >
                  <div>{{ layer.name }}</div>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <panorama :show="show" :urlImg="urlImg" @setShow="setShow"></panorama>
  </div>
</template>
<script lang="ts" setup>
import panorama from "./panorama.vue";
import panoramaPng from "/public/img/mapServer/allImg.jpg";
import {
  computed,
  nextTick,
  defineProps,
  watch,
  ref,
  onBeforeUnmount,
} from "vue";
let show = ref(false);
let urlImg = ref();
const setShow = (value) => {
  show.value = value;
};
const props = defineProps({
  ffCesium: {
    type: Object,
    required: true,
  },
});
const ffCesium = computed(() => {
  return props.ffCesium;
});
onBeforeUnmount(() => {
  if (panoramaPoint.length) {
    console.log("ffCesium", ffCesium.value);
    panoramaPoint.map((htmlOverlay) => {
      nextTick(() => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
    });
    panoramaPoint = [];
  }
});
// watch(
//   () => props.ffCesium,
//   (newValue, oldValue) => {},
//   { immediate: true }
// );
const allListArr = ref([
  // {
  //   type: "basicMapServices",
  //   name: "基础地图服务",
  //   checkAll: false,
  //   isIndeterminate: false,
  //   checkedLayers: [],
  //   expanded: false,
  //   data: [
  //     {
  //       id: "xxx1",
  //       type: "addTdtVecLayerFun",
  //       name: "天地图平面地图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://xxx/xxx.jpg",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx2",
  //       type: "addTdtCvaLayerFun",
  //       name: "天地图平面注记地图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://xxx/xxx.jpg",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx3",
  //       type: "addTdtImgLayerFun",
  //       name: "天地图影像地图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://xxx/xxx.jpg",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx4",
  //       type: "addTdtCiaLayerFun",
  //       name: "天地图影像地图注记地图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://xxx/xxx.jpg",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //   ],
  // },
  // {
  //   type: "specializedMapService",
  //   name: "专题地图服务",
  //   checkAll: false,
  //   isIndeterminate: false,
  //   checkedLayers: [],
  //   expanded: false,
  //   data: [
  //     {
  //       id: "xxx1",
  //       type: "addImgMap",
  //       name: "汤原县影像地图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://112.48.26.30:24518/tdt/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx2",
  //       type: "addDLG",
  //       name: "汤原县数字线划图",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://112.48.26.30:24518/tdt/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx3",
  //       type: "addObliquePhotography",
  //       name: "引汤灌区倾斜摄影",
  //       time: "2021-01-01 12:00:00",
  //       url: "http://192.168.9.212/3dtiles/baoli3dtile/tileset.json",
  //       lng: 118.02465704015769,
  //       lat: 24.50870669504869,
  //       checked: false,
  //       showFlag: true,
  //     },
  //     {
  //       id: "xxx4",
  //       type: "addModel",
  //       name: "重点工程模型",
  //       time: "2021-01-01 12:00:00",
  //       url: "/public/model/zhamen1.glb",
  //       // url: "/public/model/Cesium_Air.glb",
  //       lng: 129.83510111075014,
  //       lat: 46.70142729641455,
  //       height: 80, //离地高
  //       headingAngle: 0,
  //       pitchAngle: 180, //x
  //       rollAngle: -180,
  //       checked: false,
  //       showFlag: true,
  //     },
  //   ],
  // },
  {
    type: "panorama",
    name: "全景图",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    data: [
      {
        id: "xxx1",
        type: "addTdtVecLayerFun",
        name: "引汤全景图1",
        time: "2021-01-01 12:00:00",
        url: panoramaPng,
        lng: 129.76437662344546,
        lat: 46.6849432232373,
        height: 0,
        checked: false,
        showFlag: true,
      },
      {
        id: "xxx2",
        type: "addTdtVecLayerFun",
        name: "引汤全景图2",
        time: "2021-01-01 12:00:00",
        url: panoramaPng,
        lng: 129.8124418089923,
        lat: 46.720260076394595,
        height: 0,
        checked: false,
        showFlag: true,
      },
    ],
  },
]);
const handleCheckAllChange = (val, item) => {
  console.log("handleCheckAllChange--val,item", val, item);
  if (val == true) {
    item.data.forEach((element) => {
      if (!element.checked || element.checked == false) {
        element.checked = true;
        if (item.type == "basicMapServices") {
          addLayer(element.type);
        }
      }
    });
    item.checkAll = true;
  } else {
    item.data.forEach((element) => {
      if (element.checked == true) {
        if (item.type == "basicMapServices") {
          removeLayer(element.type);
        }
        element.checked = false;
      }
    });
    item.checkAll = false;
  }
  item.isIndeterminate = false;
};
const changeExpend = (item) => {
  item.expanded = !item.expanded;
  //隐藏其他选项
  if (item.expanded == true) {
    allListArr.value.forEach((element, index) => {
      if (element.type != item.type) {
        element.expanded = false;
      }
    });
  }
};
let panoramaArr = ref([]); // 创建一个响应式的空数组
let mapLayerArr = ref([]); // 创建一个响应式的空数组
let pushedLayers = new Set(); // 用来记录已经推入的图层，确保不重复推入
const handleCheckChange = (value, layer, item) => {
  setIsIndeterminate(item);
  if (value) {
    allLayer(layer, item);
  } else {
    // 处理取消选择的逻辑
    console.log("取消");

    allRemove(layer, item);
  }
};
let tileset = ref(); // 3dtileset
let glbPrimitive = ref(); // glb
let tangyuanImgMap = ref([]); //
let tangyuanDLG = ref([]); //
// 图层管理all
let panoramaPoint = [];
const allLayer = async (layer: string, item: any) => {
  if (item.type == "basicMapServices") {
    addLayer(layer.type);
  } else if (item.type == "panorama") {
    let zhuobiao = [layer.lng, layer.lat];
    let height = await ffCesium.value.getHeightAtPoint(zhuobiao);
    let lngLatHeight = [layer.lng, layer.lat, height];
    // let option = {
    //   image: "/public/img/mapServer/favicon.ico",
    //   heightReference: ffCesium.value.Cesium.HeightReference.CLAMP_TO_GROUND,
    //   pixelOffset: [0, -26], //数组第一个元素是左右方向，负值向左，第二个元素是上下方向，负值向上，
    // };
    // abc.then((result) => {
    //   console.log("abcresult", result);
    //   height = result;
    //   return result;
    // });
    console.log("abc", height);
    // console.log("abc", abc);

    let optionfly = {
      lng: layer.lng,
      lat: layer.lat,
      height: height,
      distance: 1700,
      pitchRadiu: -50,
      time: 2,
    };
    console.log("heightheight", optionfly);

    ffCesium.value.flyTo(optionfly);

    let offset = { top: 78, left: -58 };
    // let offset = { top: 90, left: -48 };
    let htmlCan = `
    <div style="display: flex" onclick='showInfo(${JSON.stringify(layer)})'>
      <div
        style="
          width: 30px;
          height: 30px;
          background-image: url('/public/img/mapServer/imglogo.png');
          background-size: 100% 100%;
        "
      >
        <div
          style="
            margin: 0 auto;
            margin-top: 27px;
            width: 2px;
            height: 50px;
            background-image: url('/public/img/mapServer/imgLine.png');
            background-size: 100% 100%;
          "
        ></div>
        <div
          style="
            margin-left: -10px;
            margin-top: -20px;
            width: 50px;
            height: 50px;
            background-image: url('/public/img/mapServer/imgBottom.png');
            background-size: 100% 100%;
          "
        ></div>
      </div>
      
      <div
        style="
          width: 100px;
          height: 30px;
          background-image: url('/public/img/mapServer/imgName.png');
          background-size: 100% 100%;
        "
      > <div style="color: white; padding-top: 5px; font-size: 14px">${
        layer.name
      }</div></div>
    </div>`;

    let con = ffCesium.value.addHtml(lngLatHeight, htmlCan, offset);
    panoramaPoint.push(con);
    con.style.zIndex = 99;
    layer.divtype = con;
    // let billboardEntity = ffCesium.value.addBillboardEntity(
    //   lngLatHeight,
    //   option
    // );
    // billboardEntity.layer = layer;
    // billboardEntity.type = item.type;
    // panoramaArr.value.push(billboardEntity);
  } else if (item.type == "specializedMapService") {
    if (layer.type == "addObliquePhotography") {
      let optionPhoto = {
        maximumMemoryUsage: 100, //不可设置太高，目标机子空闲内存值以内，防止浏览器过于卡
        maximumScreenSpaceError: 20, //用于驱动细节细化级别的最大屏幕空间错误;较高的值可提供更好的性能，但视觉质量较低。
        maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
        shadows: false, //是否显示阴影
        skipLevelOfDetail: true,
        baseScreenSpaceError: 1024,
        skipScreenSpaceErrorFactor: 16,
        skipLevels: 1,
        immediatelyLoadDesiredLevelOfDetail: false,
        loadSiblings: false,
        cullWithChildrenBounds: true,
        dynamicScreenSpaceError: true,
        dynamicScreenSpaceErrorDensity: 0.00278,
        dynamicScreenSpaceErrorFactor: 4.0,
        dynamicScreenSpaceErrorHeightFalloff: 0.25,
      };
      let promise = ffCesium.value.addObliquePhotography(
        layer.url,
        optionPhoto
      );
      promise.then((result) => {
        tileset = result;
        ffCesium.value.viewer.flyTo(tileset);
      });
    } else if (layer.type == "addModel") {
      console.log("载入模型");
      let lngLatHeight = [layer.lng, layer.lat, layer.height];
      let optionModel = {
        url: layer.url,
        headingAngle: layer.headingAngle, //y
        pitchAngle: layer.pitchAngle, //x
        rollAngle: layer.rollAngle,
        minimumPixelSize: 128,
        maximumScale: 128,
      };
      let promise = ffCesium.value.addGltfPrimitive(lngLatHeight, optionModel);
      promise.then((result) => {
        glbPrimitive = result;
      });
      let optionModelfly = {
        lng: layer.lng,
        lat: layer.lat - 0.01,
        height: layer.height + 2000,
        distance: 1700,
        pitchRadiu: -50,
        time: 2,
      };
      ffCesium.value.flyTo(optionModelfly);
    } else if (layer.type == "addImgMap") {
      let tymap = ffCesium.value.addTdtLayer(layer.url);
      tangyuanImgMap.value.push(tymap);
      // tangyuanImgMap = ffCesium.value.addTdtLayer(layer.url);
    } else if (layer.type == "addDLG") {
      let tyDLG = ffCesium.value.addTdtLayer(layer.url);
      tangyuanDLG.value.push(tyDLG);
    }
  }
};

// const divChick = () => {
window["showInfo"] = (valueParam) => {
  showInfo(valueParam);
};
const showInfo = (valueParam) => {
  console.log("123", valueParam);
  show.value = true;
  urlImg.value = valueParam.url;

  // let optionModelfly = {
  //   lng: valueParam.lng,
  //   lat: valueParam.lat - 0.02,
  //   height: 3500,
  //   distance: 1700,
  //   pitchRadiu: -50,
  //   time: 2,
  // };
  // ffCesium.value.flyTo(optionModelfly);
};
// };
// 移除图层管理all
const allRemove = (layer: string, item: any) => {
  if (item.type == "basicMapServices") {
    removeLayer(layer.type);
  } else if (item.type == "panorama") {
    ffCesium.value.removeHtml(layer.divtype);
    console.log("layer.divtype", layer.divtype);
    const indexToRemove = panoramaPoint.findIndex(
      (item) => item === layer.divtype
    );
    console.log("index", indexToRemove);
    if (indexToRemove !== -1) {
      panoramaPoint.splice(indexToRemove, 1);
    }
    console.log("panoramaPoint", panoramaPoint);

    // panorama.shift

    // panoramaArr.value.forEach((element, index) => {
    //   if (element.layer.id == layer.id) {
    //     ffCesium.value.removeFFEntity(element);
    //     panoramaArr.value.splice(index, 1);
    //   }
    // });
  } else if (item.type == "specializedMapService") {
    if (layer.type == "addObliquePhotography") {
      ffCesium.value.removeObliquePhotography(tileset);
    } else if (layer.type == "addModel") {
      ffCesium.value.removeFFPrimitive(glbPrimitive);
    } else if (layer.type == "addImgMap") {
      tangyuanImgMap.value.forEach((element, index) => {
        ffCesium.value.removeMapLayer(element);
        tangyuanImgMap.value.shift();
      });
    } else if (layer.type == "addDLG") {
      tangyuanDLG.value.forEach((element, index) => {
        ffCesium.value.removeMapLayer(element);
        tangyuanDLG.value.shift();
      });
    }
  }
};
// 基础地图服务
const addLayer = (type: string) => {
  switch (type) {
    case "addTdtVecLayerFun":
      if (!pushedLayers.has("addTdtVecLayerFun")) {
        let lay = ffCesium.value.addTdtVecLayer();
        lay.type = "addTdtVecLayerFun";
        mapLayerArr.value.push(lay);
        pushedLayers.add("addTdtVecLayerFun");
      }
      break;
    case "addTdtCvaLayerFun":
      if (!pushedLayers.has("addTdtCvaLayerFun")) {
        let lay2 = ffCesium.value.addTdtCvaLayer();
        lay2.type = "addTdtCvaLayerFun";
        mapLayerArr.value.push(lay2);
        pushedLayers.add("addTdtCvaLayerFun");
      }
      break;
    case "addTdtImgLayerFun":
      if (!pushedLayers.has("addTdtImgLayerFun")) {
        let lay3 = ffCesium.value.addTdtImgLayer();
        lay3.type = "addTdtImgLayerFun";
        mapLayerArr.value.push(lay3);
        pushedLayers.add("addTdtImgLayerFun");
      }
      break;
    case "addTdtCiaLayerFun":
      if (!pushedLayers.has("addTdtCiaLayerFun")) {
        let lay4 = ffCesium.value.addTdtCiaLayer();
        lay4.type = "addTdtCiaLayerFun";
        mapLayerArr.value.push(lay4);
        pushedLayers.add("addTdtCiaLayerFun");
      }
      break;
  }
};
// 移除基础地图服务
const removeLayer = (type: string) => {
  mapLayerArr.value.forEach((item) => {
    if (item.type == type) {
      let indexToRemove = mapLayerArr.value.findIndex(
        (lay) => lay.type === type
      );
      mapLayerArr.value.splice(indexToRemove, 1);
      pushedLayers.delete(type);
      console.log("要删除", item);
      ffCesium.value.viewer.imageryLayers.remove(item, true);
      //   ffCesium.value.removeMapLayer(layer);
    }
  });
};
const setIsIndeterminate = (item) => {
  let checkedCount = 0;
  item.data.forEach((element) => {
    if (element.checked == true) {
      checkedCount = checkedCount + 1;
    }
  });
  if (checkedCount == 0) {
    item.isIndeterminate = false;
    item.checkAll = false;
  } else if (checkedCount == item.data.length) {
    item.isIndeterminate = false;
    item.checkAll = true;
  } else {
    item.isIndeterminate = true;
  }
};
</script>
<style lang="scss" scoped>
.popBox {
  position: absolute;
  top: 30px;
  left: 50px;
  z-index: 999;
}
.el-checkbox {
  background-color: #11253e;
}
::v-deep(.el-checkbox) {
  background-color: #11253e;
}
::v-deep(.el-input__wrapper) {
  background-color: #11253e;
  box-shadow: 0 0 0 1px #475467 inset;
}
::v-deep(.el-input__inner) {
  color: #98a2b3;
}
::v-deep(.el-input.is-disabled .el-input__wrapper) {
  color: #98a2b3;
  background-color: #11253e;
  box-shadow: 0 0 0 1px #475467 inset;
}
::v-deep(.el-checkbox__label) {
  display: inline-block;
  padding-left: 8px;
  line-height: 1;
  font-size: var(--el-checkbox-font-size);
  color: #ffffff;
}
::v-deep(.el-range-separator) {
  color: #a8abb2;
}
</style>
