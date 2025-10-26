<template>
  <div class="flex-container" style="width: 100%; height: 100%">
    <div class="flex-item1">
      <div
        v-if="panoramaImgShowFlag"
        style="
          position: absolute;
          left: 0px;
          top: 0px;
          width: 500px;
          height: 400px;
          z-index: 999;
        "
      >
        <div
          @click="closePanoramaImg"
          style="
            position: absolute;
            right: 10px;
            top: 6px;
            font-weight: 700;
            font-size: 16px;
            color: #000000;
            cursor: pointer;
            z-index: 999;
            background-color: rgba(17, 37, 62, 0.75);
            padding: 5px;
            color: rgba(255, 255, 255, 0.75);
          "
        >
          关闭
        </div>
        <div
          id="viewerID"
          style="width: 500px; height: 400px; background-color: red"
        ></div>
      </div>
      <div class="map-100">
        <mainMapWidget :showPlotLyr="true" />
      </div>
    </div>
    <div class="flex-item2">
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
          模型列表
        </div>

        <div
          style="
            padding: 16px;
            background-color: #001129;
            height: calc(100% - 86px);
          "
        >
          <el-input
            v-if="useType == 'oneMap'"
            placeholder="请输入模型名称"
            style="width: 260px"
            v-model="filterName"
            @input="filterChange"
          />
          <el-date-picker
            v-if="useType == 'oneMap'"
            style="width: 260px; margin-top: 16px; margin-bottom: 15px"
            @change="filterChange"
            v-model="filterTime"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

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
                style="padding-left: 10px"
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
                  <div style="color: #98a2b3; font-size: 12px">
                    {{ layer.time }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          align="center"
          v-if="useType == 'projectMap'"
          style="background-color: #11253e; height: 48px; bottom: 0px"
        >
          <el-button type="primary" style="margin-top: 8px" @click="save"
            >保存</el-button
          >
          <el-button
            style="
              margin-top: 8px;
              background-color: #475467;
              color: #ffffff;
              border: none;
            "
            @click="cancle"
            >返回</el-button
          >
        </div>
        <div
          align="center"
          v-if="useType == 'oneMap'"
          style="background-color: #001129; height: 48px; bottom: 0px"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RealTimeFlyMap",
};
</script>
<script setup>
import {
  onMounted,
  onUnmounted,
  onBeforeUpdate,
  onBeforeUnmount,
  nextTick,
} from "vue";
import {
  getCesiumEngineInstance,
  flyTo,
} from "@/components/Cesium/libs/cesium";
import mainMapWidget from "../map-fly-manager/components/homeMainMap.vue";
import {
  getProjectModel,
  getProjectLists,
  saveProjectModel,
} from "@/api/plot/index.js";
import { useUserStoreHook } from "@/store/modules/user";
import FFCesium from "../map-fly-manager/realtimeflight/SituationPlotting/FFCesium/core/index.js";
import { useRoute, useRouter } from "vue-router";
import router from "@/router";

import panoramaPng from "./image/panorama.png";
import { ElMessage } from "element-plus";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css"; //引入CSS样式

const filterName = ref("");
const filterTime = ref(null);
const panoramaImgUrl = ref("");
const panoramaImgShowFlag = ref(false);
const closePanoramaImg = () => {
  panoramaImgShowFlag.value = false;
};

const route = useRoute();
const useType = ref("");
if (!route.query.useType) {
  useType.value = "oneMap";
} else {
  useType.value = route.query.useType;
}

const projectId = route.query.projectId;
console.log("projectId123", projectId);
//let useType = 'projectMap'; //oneMap  projectMap
const allListArr = ref([
  {
    type: "obliquePhotography",
    name: "倾斜摄影",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    data: [],
  },
  {
    type: "pointCloud",
    name: "点云",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    data: [],
  },
  {
    type: "2dMap",
    name: "2维地图",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    data: [],
  },
  {
    type: "panorama",
    name: "全景图",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    data: [],
  },
]);
const filterChange = () => {
  console.log("filterChange--filterName", filterName.value);
  console.log("filterChange--filterTime", filterTime.value);
  allListArr.value.forEach((item) => {
    item.data.forEach((element, index) => {
      if (element.name.indexOf(filterName.value) != -1 && isInTime(element)) {
        element.showFlag = true;
      } else {
        element.showFlag = false;
      }
    });
  });
  console.log("filterChange--allListArr", allListArr);
};
const isInTime = (element) => {
  if (!filterTime.value) {
    return true;
  }

  if (
    element.time > filterTime.value[0] &&
    element.time < filterTime.value[1]
  ) {
    return true;
  } else {
    return false;
  }
};

const save = async () => {
  console.log("保存数据");
  //saveProjectModel
  let data = {};
  data.project_id = projectId;
  data.model_ids = [];
  allListArr.value.forEach((item, index) => {
    item.data.forEach((element) => {
      if (element.checked == true) {
        data.model_ids.push(element.id);
      }
    });
  });
  console.log("save-参数", data);
  let saveResult = await saveProjectModel(workspace_id, data);
  console.log("save--saveResult", saveResult);
  if (saveResult == "") {
    ElMessage({
      message: "保存成功",
      type: "success",
    });
    //router.push('/engineering-manage');
  }
};
const cancle = () => {
  router.push("/engineering-manage");
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

const handleCheckAllChange = (val, item) => {
  console.log("handleCheckAllChange--val,item", val, item);
  if (val == true) {
    item.data.forEach((element) => {
      if (!element.checked || element.checked == false) {
        addLayer(element);
        element.checked = true;
      }
    });
    item.checkAll = true;
  } else {
    item.data.forEach((element) => {
      if (element.checked == true) {
        removeLayer(element);
        element.checked = false;
      }
    });
    item.checkAll = false;
  }
  item.isIndeterminate = false;
};

let obliquePhotographyTileArr = [];
let pointCloudTileArr = [];
let map2DArr = [];
let panoramaArr = [];
const addLayer = (layer) => {
  console.log("addLayer--layer", layer);
  let resultTile = null;
  if (layer.type == "obliquePhotography") {
    resultTile = addObliquePhotographyFun(layer);
    console.log("resultTile123", resultTile);
    resultTile.layer = layer;
    obliquePhotographyTileArr.push(resultTile);
  }
  if (layer.type == "pointCloud") {
    resultTile = addPointCloudFun(layer);
    resultTile.layer = layer;
    pointCloudTileArr.push(resultTile);
  }
  if (layer.type == "2dMap") {
    var mapOption = {
      url: layer.url,
    };
    var imgProvider = new ffCesium.Cesium.UrlTemplateImageryProvider(mapOption);
    console.log("ffCesium.viewer1", ffCesium.viewer);
    resultTile = ffCesium.viewer.imageryLayers.addImageryProvider(imgProvider);
    console.log("二维底图：resultTile", resultTile);
    resultTile.layer = layer;
    map2DArr.push(resultTile);
  }

  if (layer.type == "panorama") {
    let lngLatHeight = [layer.lng, layer.lat];
    let option = {
      image: panoramaPng,
      heightReference: ffCesium.Cesium.HeightReference.CLAMP_TO_GROUND,
      pixelOffset: [0, -26], //数组第一个元素是左右方向，负值向左，第二个元素是上下方向，负值向上，
    };
    let billboardEntity = ffCesium.addBillboardEntity(lngLatHeight, option);
    billboardEntity.layer = layer;
    panoramaArr.push(billboardEntity);
  }
  return resultTile;
};
const removeLayer = (layer) => {
  if (layer.type == "obliquePhotography") {
    obliquePhotographyTileArr.forEach((element, index) => {
      if (element.layer.id == layer.id) {
        ffCesium.viewer.scene.primitives.remove(element);
        obliquePhotographyTileArr.splice(index, 1);
      }
    });
  }
  if (layer.type == "pointCloud") {
    pointCloudTileArr.forEach((element, index) => {
      if (element.layer.id == layer.id) {
        ffCesium.viewer.scene.primitives.remove(element);
        pointCloudTileArr.splice(index, 1);
      }
    });
  }
  if (layer.type == "2dMap") {
    map2DArr.forEach((element, index) => {
      if (element.layer.id == layer.id) {
        ffCesium.viewer.imageryLayers.remove(element);
        map2DArr.splice(index, 1);
      }
    });
  }

  if (layer.type == "panorama") {
    panoramaArr.forEach((element, index) => {
      if (element.layer.id == layer.id) {
        ffCesium.removeFFEntity(element);
        panoramaArr.splice(index, 1);
      }
    });
  }
};

const handleCheckChange = (value, layer, item) => {
  setIsIndeterminate(item);
  console.log("handleCheckChange--value", value);
  let offsetTemp = new ffCesium.Cesium.HeadingPitchRange(
    ffCesium.Cesium.Math.toRadians(0),
    ffCesium.Cesium.Math.toRadians(-80),
    0
  );
  if (value == true) {
    let tile3d = addLayer(layer);
    if (layer.type == "obliquePhotography" || layer.type == "pointCloud") {
      ffCesium.viewer.flyTo(tile3d, { offset: offsetTemp });
    } else if (layer.type == "2dMap" || layer.type == "panorama") {
      if (!layer.lng || !layer.lat) {
        ElMessage({
          message: "未设置定位坐标",
          type: "warning",
        });
        return;
      }
      let option = {
        lng: layer.lng,
        lat: layer.lat,
        eyeHeight: 40000,
        pitchRadiu: -50,
        time: 3,
      };
      ffCesium.flyTo(option);
    }
  } else {
    removeLayer(layer);
  }
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
const userStore = useUserStoreHook();
const { userData } = userStore;
const { workspace_id } = userData;
let ffCesium = null;
let pathSuffix = "";
if (import.meta.env.VITE_APP_NODE_ENV === "development") {
  pathSuffix = "http://125.77.202.162:24176";
} else {
  pathSuffix = window.location.origin;
}
pathSuffix = pathSuffix + "/uavfile/";

const initFFCesium = async () => {
  const viewerTemp = getCesiumEngineInstance("homeMap-fly").viewer;
  ffCesium = new FFCesium("mainMapContainer", { viewer: viewerTemp });
  console.log("initFFCesium--ffCesium", ffCesium);

  ffCesium.viewer.scene.globe.depthTestAgainstTerrain = false; //（开启）

  let checkData = [];
  if (useType.value == "projectMap") {
    let checkDataResult = await getProjectModel(workspace_id, projectId);
    console.log("initFFCesium--checkDataResult", checkDataResult);
    if (!checkDataResult.model_ids) {
      checkData = [];
    } else {
      checkData = checkDataResult.model_ids;
    }
  }

  let listDataResult = await getProjectLists(workspace_id, {
    model_types: ["QX", "2D", "DY", "QJ"],
  });
  listDataResult.forEach((item) => {
    item.id = item.model_id;
    if (item.type == "QX") {
      item.type = "obliquePhotography";
      item.backType = "QX";
      item.url = pathSuffix + item.url + "/tileset.json";
    }
    if (item.type == "DY") {
      item.type = "pointCloud";
      item.backType = "DY";
      item.url = pathSuffix + item.url + "/tileset.json";
    }
    if (item.type == "2D") {
      item.type = "2dMap";
      item.backType = "2D";
      item.url = pathSuffix + item.url + "/{z}/{x}/{y}.png";
    }
    if (item.type == "QJ") {
      item.type = "panorama";
      item.backType = "QJ";
      item.url = pathSuffix + item.url;
    }
  });
  console.log("initFFCesium--listDataResult", listDataResult);
  /**
  let checkData = ['xxx1', 'xxx3', 'xxx5']; //选中数据
  //所有列表数据
  let listData = [
    //倾斜摄影
    //url: pathSuffix + 'model/e3dea0f5-37f2-4d79-ae58-490af3228069/QX/test22222DDDD/tileset.json'
    //url: 'http://192.168.9.212/3dtiles/xysk/tileset.json'
    {
      id: 'xxx1',
      type: 'obliquePhotography',
      name: '某山区倾斜摄影',
      time: '2024-06-26 18:00:00',
      url: 'http://192.168.9.212/3dtiles/xysk/tileset.json'
    },
    {
      id: 'xxx2',
      type: 'obliquePhotography',
      name: '某小区倾斜摄影',
      time: '2024-06-16 18:00:00',
      url: pathSuffix + 'model/e3dea0f5-37f2-4d79-ae58-490af3228069/QX/baoli3dtile/tileset.json'
    },
    //点云
    // url: 'http://192.168.15.228:8078/mapdata/PointCloud/tileset.json'
    // url: pathSuffix + '/model/e3dea0f5-37f2-4d79-ae58-490af3228069/DYpointCloud/tileset.json'
    {
      id: 'xxx3',
      type: 'pointCloud',
      name: '某房屋点云图',
      time: '2024-06-12 18:00:00',
      url: pathSuffix + 'model/e3dea0f5-37f2-4d79-ae58-490af3228069/DY/PointCloud/tileset.json'
    },
    //2维地图
    //      url: 'http://192.168.15.228:8078/mapdata/arcgisYX/' + '{z}/{x}/{y}.png',
    //      url: 'http://192.168.15.228:8078/mapdata/arcgisYX/' + '{z}/{x}/{y}.png',

    {
      id: 'xxx4',
      type: '2dMap',
      name: '某区域二维影像图',
      time: '2024-06-02 18:00:00',
      url: pathSuffix + 'model/e3dea0f5-37f2-4d79-ae58-490af3228069/2D/arcgisYX' + '/{z}/{x}/{y}.png',
      lng: 118.02465704015769,
      lat: 24.50870669504869
    },

    //全景图
    {
      id: 'xxx5',
      type: 'panorama',
      name: '某农产全景图',
      time: '2021-01-01 12:00:00',
      url: 'http://xxx/xxx.jpg',
      lng: 118.02465704015769,
      lat: 24.50870669504869
    }
  ];
  */
  //数据处理
  dealData(checkData, listDataResult);

  //附加点击事件
  addHandle();
};
let panoramaViewer;
const addHandle = () => {
  console.log("addHandle附加事件");
  let handler = new ffCesium.Cesium.ScreenSpaceEventHandler(
    ffCesium.viewer.canvas
  );
  // 对鼠标按下事件的监听
  handler.setInputAction(function (event) {
    const windowPosition = event.position;
    const pickedObject = ffCesium.viewer.scene.pick(windowPosition);
    if (ffCesium.Cesium.defined(pickedObject)) {
      console.log("addHandle--pickedObject.id", pickedObject.id);
      if (pickedObject.id.layer.id) {
        if (panoramaViewer) {
          panoramaViewer.destroy();
          panoramaViewer = null;
        }
        panoramaImgUrl.value = pickedObject.id.layer.url;
        console.log("pickedObject.id", pickedObject.id);
        console.log("panoramaImgUrl", panoramaImgUrl);
        panoramaImgShowFlag.value = true;
        nextTick(() => {
          panoramaViewer = new Viewer({
            container: "#viewerID",
            panorama: panoramaImgUrl.value,
          });
        });
      }
    }
  }, ffCesium.Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
//数据处理
const dealData = (checkData, listData) => {
  console.log("dealData--checkData, listData", checkData, listData);
  listData.forEach((item) => {
    let indexTemp = 0;
    if (item.type == "obliquePhotography") {
      indexTemp = 0;
    } else if (item.type == "pointCloud") {
      indexTemp = 1;
    } else if (item.type == "2dMap") {
      indexTemp = 2;
    } else if (item.type == "panorama") {
      indexTemp = 3;
    }
    item.showFlag = true;
    if (useType.value == "projectMap") {
      console.log("dealData--是否选中", checkData.indexOf(item.id));
      if (checkData.indexOf(item.id) >= 0) {
        item.checked = true;
        addLayer(item);
      } else {
        item.checked = false;
      }
    }

    allListArr.value[indexTemp].data.push(item);
  });
  allListArr.value.forEach((item) => {
    setIsIndeterminate(item);
  });
  console.log("dealData-- allListArr.value", allListArr.value);
};

const addObliquePhotographyFun = (item) => {
  console.log("addObliquePhotographyFun--item", item);
  let option = {
    url: item.url,
  };
  console.log("addObliquePhotographyFun--option", option);
  var tileset = new ffCesium.Cesium.Cesium3DTileset(option);
  console.log("tileset123", tileset);
  ffCesium.viewer.scene.primitives.add(tileset);
  //ffCesium.viewer.flyTo(tileset);
  return tileset;
};

const addPointCloudFun = (item) => {
  console.log("addPointCloudFun--item", item);
  let option = {
    url: item.url,
  };
  console.log("addPointCloudFun--option", option);
  var tileset = new ffCesium.Cesium.Cesium3DTileset(option);
  ffCesium.viewer.scene.primitives.add(tileset);
  //ffCesium.viewer.flyTo(tileset);
  return tileset;
};

onMounted(() => {
  setTimeout(() => {
    initFFCesium();
  }, 100);
});
</script>

<style lang="scss" scoped>
.map-100 {
  height: 100%;
  width: 100%;
}

:deep(.el-input__wrapper) {
  background-color: #11253e;
  box-shadow: 0 0 0 1px #475467 inset;
}
:deep(.el-input__inner) {
  color: #98a2b3;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  color: #98a2b3;
  background-color: #11253e;
  box-shadow: 0 0 0 1px #475467 inset;
}

.flex-container {
  display: flex; /* 使用Flex布局 */
  flex-direction: row;
}
.flex-item1 {
  flex: 1; /* 随父级变化 background: red;*/
  height: 100%;
}
.flex-item2 {
  flex: 0 0 300px; /* 左侧固定200px background: burlywood;*/
  height: 100%;
}

:deep(.el-checkbox__label) {
  display: inline-block;
  padding-left: 8px;
  line-height: 1;
  font-size: var(--el-checkbox-font-size);
  color: #ffffff;
}
:deep(.el-range-separator) {
  color: #a8abb2;
}
</style>
