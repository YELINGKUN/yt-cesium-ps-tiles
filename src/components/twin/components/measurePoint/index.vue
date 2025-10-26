<template>
  <div class="box">
    <div class="modelList">
      <div class="modeTitle">全部模型</div>
      <div class="list" style="padding: 16px; background-color: #001129">
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
              <!-- 1 -->
              <el-checkbox
                style="padding-left: 10px"
                v-model="item.checkAll"
                :indeterminate="item.isIndeterminate"
                @change="handleCheckChange($event, item, null)"
              >
                <!-- @change="handleCheckAllChange($event, item)" -->
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
            <!-- 2 -->
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
              <!-- 3 -->
              <!-- v-show="item.showChild" -->
              <div style="padding-left: 32px" v-for="node in layer.value">
                <el-checkbox
                  @change="handleCheckChange($event, node, layer)"
                  v-model="node.checked"
                  :key="node.id"
                  :label="node.name"
                  :value="node.id"
                >
                  <div>{{ node.name }}</div>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-tree
        class="modeltree"
        style="max-width: 600px"
        :data="data"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @check-change="changeshow"
      /> -->
    </div>
  </div>
  <div id="tooltip-view" style="z-index: 9999; display: none">
    <div
      @click="changeheight"
      class="cesium-popup-background"
      style="padding: 1px 0"
    >
      控闸
    </div>
  </div>
</template>
<script lang="ts" setup>
import panoramaPng from "../../images/ou/point/水库.svg";
import allListArr from "./index.js";
import titleBack from "../../images/ou/model/titleBack.png";
// import modelurl from "../../images/ou/gltf/daba.glb";
import {
  onMounted,
  onBeforeUnmount,
  ref,
  reactive,
  defineProps,
  watch,
  computed,
  nextTick,
} from "vue";
const props = defineProps({
  ffCesium: {
    type: Object,
    required: true,
  },
  showGate: {
    type: Boolean,
    required: true,
  },
});
const ffCesium = computed(() => {
  return props.ffCesium;
});
onMounted(() => {
  nextTick(() => {
    addMODEL();
  });
});
// 定义初始和目标位置
// 设置初始位置和目标位置
const startPosition = ffCesium.value.Cesium.Cartesian3.fromDegrees(
  129.78207817041048,
  46.69279627278922,
  110
);
const endPosition = ffCesium.value.Cesium.Cartesian3.fromDegrees(
  129.78207817041048,
  46.69279627278922,
  125
);

// 计算时间间隔
const duration = 5000; // 5 seconds

// 过渡函数
const startTime = ffCesium.value.Cesium.JulianDate.now();
const endTime = ffCesium.value.Cesium.JulianDate.addSeconds(
  startTime,
  duration / 1000,
  new ffCesium.value.Cesium.JulianDate()
);
// const updateModelPosition = (model) => {
//   const now = ffCesium.value.Cesium.JulianDate.now();
//   const t =
//     ffCesium.value.Cesium.JulianDate.secondsDifference(now, startTime) /
//     (duration / 1000);

//   if (t >= 1) {
//     model.modelMatrix =
//       ffCesium.value.Cesium.Transforms.eastNorthUpToFixedFrame(endPosition);
//   } else {
//     const interpolatedPosition = ffCesium.value.Cesium.Cartesian3.lerp(
//       startPosition,
//       endPosition,
//       t,
//       new ffCesium.value.Cesium.Cartesian3()
//     );
//     model.modelMatrix =
//       ffCesium.value.Cesium.Transforms.eastNorthUpToFixedFrame(
//         interpolatedPosition
//       );
//     console.log("125");

//     requestAnimationFrame(updateModelPosition);
//   }
// };
// requestAnimationFrame(updateModelPosition);

// 创建PositionProperty来存储位置

var positionProperty = new ffCesium.value.Cesium.SampledPositionProperty();
// 设置初始位置
positionProperty.addSample(
  ffCesium.value.viewer.clock.currentTime,
  startPosition
);

// 设置目标位置
positionProperty.addSample(
  ffCesium.value.Cesium.JulianDate.addSeconds(
    ffCesium.value.viewer.clock.currentTime,
    10,
    new ffCesium.value.Cesium.JulianDate()
  ),
  endPosition
);
// 定义模型矩阵更新函数
const updateModelMatrix = (time, model) => {
  var position = positionProperty.getValue(time);
  if (position) {
    model.modelMatrix =
      ffCesium.value.Cesium.Transforms.eastNorthUpToFixedFrame(position);
  }
};
// 注册更新函数到Cesium的渲染循环
// ffCesium.value.viewer.scene.preRender.addEventListener(function () {
//   // console.log("545454");
//   // allDoor.value.map((i) => {
//   //   updateModelMatrix(5000, i);
//   // });
// });
watch(
  () => props.showGate,
  (newVal, oldVal) => {
    if (newVal) {
      // 假设你已经有一个模型引用

      allDoor.value.map((i) => {
        // updateModelMatrix(5000, i);
        // console.log("open", i);
        // console.log("modelMatrix", i.modelMatrix);
        // console.log("openfValue", i.fValue.lng, i.fValue.lat);
        // updateModelPosition(i);
        // // 定义新的位置
        // var newHeight = 120.0;
        // // // 计算新的模型矩阵
        // i.modelMatrix =
        //   ffCesium.value.Cesium.Transforms.eastNorthUpToFixedFrame(
        //     ffCesium.value.Cesium.Cartesian3.fromDegrees(
        //       i.fValue.lng,
        //       i.fValue.lat,
        //       newHeight
        //     )
        //   );
      });
    } else {
      console.log("off");
    }
  }
);
let modelList = ref([]);
const contentModel = async (model, lngLat) => {
  let height = await ffCesium.value.getHeightAtPoint(lngLat);
  let lngLatHeight = [...lngLat, height];
  let offset = { top: 0, left: 0 };
  // let htmlOverlay = document.getElementById("tooltip-view");
  // htmlOverlay.lngLatHeight = lngLatHeight;
  // let abc = ffCesium.value.addHtmlForVue(lngLatHeight, htmlOverlay, offset);
  // abc.style.zIndex = 999;
  let htmlmodel = `<div style='cursor:pointer;width:50px;height:30px;line-height:30px;background: rgba(0, 0, 0, 0.6);margin: 10px auto;text-align: center;color: #fff; border-radius: 6px;'>
  <div>控闸</div>
          </div>`;
  // let htmlmodel =
  //   "<div  style='cursor:pointer;width:124px;height:30px;background-image:url(/public/img/mapServer/modelBack.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '><div style='padding-top:3px;'>" +
  //   model.name +
  //   "</div><div style='width: 20px; padding-top:30px; margin-left:49px; margin-top:12px; background-image:url(/public/img/mapServer/modelPoint.png);background-repeat: no-repeat;'>";
  // ("</div></div>");
  let ooo = ffCesium.value.addHtml(lngLatHeight, htmlmodel, offset);
  console.log("000", ooo);

  // modelList.value.push(ooo);
  // });
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
  // item.isIndeterminate = false;
};
const changeheight = () => {
  console.log("4444");
};
const handleCheckChange = (value, layer, item) => {
  let optionModelfly = {
    lng: layer.lng,
    lat: layer.lat,
    height: layer.height,
    distance: 1000,
    pitchRadiu: -30,
    headingRadiu: -90,
    time: 2,
  };
  if (layer.level == 1) {
    if (value) {
      ffCesium.value.flyToHeading(optionModelfly);
    }
  } else if (layer.level == 2) {
    optionModelfly.lat = layer.lat - 0.0008;
    optionModelfly.distance = 100;
    if (value) {
      ffCesium.value.flyToHeading(optionModelfly);
    }
  } else if (layer.level == 3) {
    if (value) {
      optionModelfly.distance = 50;
      if (layer.id == "a1") {
        optionModelfly.lat = layer.lat - 0.001;
      } else if (layer.id == "a2") {
        optionModelfly.lat = layer.lat - 0.00094;
      } else if (layer.id == "a5") {
        optionModelfly.lat = layer.lat - 0.00075;
      }
      ffCesium.value.flyToHeading(optionModelfly);

      allgate.value.map((item) => {
        if (item.idValue === layer.id) {
          item.silhouetteSize = 5.0;
          item.silhouetteColor = new ffCesium.value.Cesium.Color(1, 1, 0, 1.0);
          console.log("item", layer);
          if (layer.id == "a1") {
            optionModelfly.lat = layer.lat - 0.001;
            // contentModel(layer, [layer.lng, optionModelfly.lat]);
          } else if (layer.id == "a2") {
            optionModelfly.lat = layer.lat - 0.00094;
          } else if (layer.id == "a5") {
            optionModelfly.lat = layer.lat - 0.00075;
          }
        }
      });
      allDoor.value.map((item) => {
        if (item.idValue === layer.id) {
          item.silhouetteSize = 5.0;
          item.silhouetteColor = new ffCesium.value.Cesium.Color(1, 1, 0, 1.0);
        }
      });
    } else {
      allgate.value.map((item) => {
        if (item.idValue === layer.id) {
          item.silhouetteSize = 0.0;
        }
      });
      allDoor.value.map((item) => {
        if (item.idValue === layer.id) {
          item.silhouetteSize = 0;
        }
      });
    }
  }
  // ffCesium.value.flyToHeading(optionModelfly);
};

// 添加model
let allModel: object = ref([]);
let allgate: object = ref([]);
let allDoor: object = ref([]);
const addMODEL = () => {
  let lngLatHeight: Number[] = [];
  allListArr.value.map((item) => {
    lngLatHeight = [item.lng, item.lat, item.height];
    console.log("zuobiao", lngLatHeight);

    let promise = ffCesium.value.addGltfPrimitive(
      lngLatHeight,
      item.optionModel
    );
    promise.then((result) => {
      result.typeValue = "model";
      allModel.value.push(result);
    });
    item.data.map((demo) => {
      demo.value.map((node) => {
        let lngLatHeightZ = [node.lng, node.lat, node.height];
        let optionGate = ffCesium.value.addGltfPrimitive(
          lngLatHeight,
          node.optionModel
        );
        console.log("node.id", node.id);
        optionGate.then((result) => {
          result.idValue = node.id;
          node.gate = result;
          allgate.value.push(result);
        });
        let optionDoor = ffCesium.value.addGltfPrimitive(
          lngLatHeightZ,
          node.optionDoor
        );
        optionDoor.then((result) => {
          result.idValue = node.id;
          result.fValue = node;
          node.door = result;
          allDoor.value.push(result);
        });
        // let promise = ffCesium.value.addGLTFentity(
        //   item.lngLatHeight,
        //   node.optionModel
        // );
      });
    });
  });
};
</script>
<style scoped>
.box {
  position: absolute;
  top: 250px;
  left: 80px;
  z-index: 999;
}
.modelList {
  width: 210px;
  height: 268px;
}
.modeTitle {
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-image: url("../../images/ou/model/titleBack.png");
  color: aliceblue;
}
.modeltree {
  color: aliceblue;
  height: 224px;
  width: 210px;
  background-image: url("../../images/ou/model/listBack.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
::v-deep(.el-tree) {
  background: transparent;
  background-image: url("../../images/ou/model/listBack.png");
}
::v-deep(.el-tree-node__content:hover) {
  background-color: rgb(103, 113, 121) !important;
}
::v-deep(.el-tree-node.is-current .el-tree-node__content) {
  background-color: transparent !important; /* 设置选中状态的背景颜色 */
}
/* ::v-deep(.el-tree-node__content:hover.after) {
  background-color: rgb(103, 113, 121) !important;
} */
/* ::v-deep(.el-tree-node.is-current) {
  background-color: transparent !important;
} */
.cesium-popup-background {
  display: inline-block;
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  color: aliceblue;
}
</style>
