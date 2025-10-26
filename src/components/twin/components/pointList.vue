<template>
  <!-- <div id="tooltip-view" style="z-index: 9999; display: none">
    <div class="cesium-popup-background" style="padding: 1px 0"></div>
  </div> -->
  <div
    id="gagaga"
    style="
      display: none;
      width: 50px;
      height: 50px;
      background-color: aliceblue;
    "
  >
    <div>5454</div>
  </div>
  <div class="box" id="box">
    <!-- <el-tree
      style="max-width: 600px"
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
    /> -->
  </div>
</template>
<script lang="ts" setup>
import engineeringBLogo from "../images/ou/engineering/logo/水闸.svg";
import shuikuLogo from "../images/ou/engineering/logo/水库.svg";
import viewLogo from "../images/ou/engineering/logo/视频点.svg";
import regimenLogo from "../images/ou/engineering/logo/测点图标/水情.svg";

import cedianBack from "../images/ou/engineering/测点设备图标/蓝色图标背景.png";

import engineeringBtitle from "../images/ou/engineering/蓝色文字背景.png";
import engineeringBBack from "../images/ou/engineering/蓝色图标背景.png";
import engineeringBLine from "../images/ou/engineering/减速蓝色光柱.png";
import engineeringBbottom from "../images/ou/engineering/蓝色底座.png";

import engineeringRtitle from "../images/ou/engineering/红色文字背景.png";
import engineeringRBack from "../images/ou/engineering/减速图标背景/红色.png";
import engineeringRLine from "../images/ou/engineering/减速红色光柱.png";
import engineeringRbottom from "../images/ou/engineering/红色底座.png";

import engineerPintBbottom from "../images/ou/static/底座/蓝色底座.png";
import engineerPintBLine from "../images/ou/static/柱子/蓝色柱子备份.png";
import engineerPintBback from "../images/ou/static/图标背景/蓝色背景.png";
// import zdian from "./闸控点.json";
import { zhakongdian, viewDate, regimenDate } from "./point/point.js";
import data from "./point/engineering.js";
// console.log("zdian", zdian);
console.log("zdiandian", zhakongdian);

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
  layershow: {
    type: Array,
    required: true,
  },
});
const ffCesium = computed(() => {
  return props.ffCesium;
});
const emit = defineEmits(["LayerShow"]);
let layershow = ref(props.layershow);
const changelayershow = () => {
  layershow.value.map((item) => {
    // item
    if (item.name == "面") {
      item.show = !item.show;
      emit("LayerShow", layershow.value);
    }
  });
};

// console.log("123123ffcesium", ffCesium.value);
// watch(
//   () => ffCesium.value,
//   (newVal, oldVal) => {
//     console.log("newVal", newVal);
//     console.log("oldVal", oldVal);
//   },
//   { immediate: true }
// );
const lineValue = ref([]);
let peopleArr = ref([]);
const handleNodeClick = (data, node) => {
  let optionModelfly = {
    lng: node.data.lng,
    lat: node.data.lat - 0.012,
    height: node.data.Camaralength,
    distance: 1700,
    pitchRadiu: -50,
    time: 2,
  };

  // if (node.level === 3) {
  // }
  if (node.level === 4) {
    // optionModelfly = {
    //   lng: node.data.lng,
    //   lat: node.data.lat,
    //   height: node.data.Camaralength,
    //   distance: 500,
    //   pitchRadiu: -30,
    //   time: 2,
    // };
    optionModelfly.lat = node.data.lat;
    optionModelfly.pitchRadiu = -25;
    allModel.value.map((item) => {
      if (item.idValue === node.data.id) {
        // console.log("item", item);

        item.silhouetteSize = 3;
        item.silhouetteColor = new ffCesium.value.Cesium.Color(1, 1, 0, 1.0);
      } else {
        item.silhouetteSize = 0;
      }
    });
  }
  ffCesium.value.flyTo(optionModelfly, flyCallback);
};
const flyCallback = () => {
  let height = ffCesium.value.viewer.camera.positionCartographic.height;
  heightC(height);
};
watch(
  () => props.layershow,
  (newValue, oldValue) => {
    newValue.map((node) => {
      if (node.name == "闸控点") {
        if (node.show) {
          console.log("node闸控点", node);
          zhamen.value.map((item) => {
            item.style.opacity = 1;
          });
          twoHtml.value.map((item) => {
            item.style.opacity = 0;
          });
        } else {
          zhamen.value.map((item) => {
            item.style.opacity = 0;
          });
        }
      } else if (node.name == "视频点") {
        if (node.show) {
          console.log("node视频点", node);
          if (!allChild.value.length) {
            let demo = addChildPoint(regimenDate);
            allChild.value.push(demo.value);
          } else {
            allChild.value.map((item) => {
              item.map((node) => {
                node.style.opacity = 1;
              });
            });
          }
        } else {
          allChild.value.map((item) => {
            item.map((node) => {
              node.style.opacity = 0;
            });
          });
        }
      } else if (node.name == "水情点") {
        console.log("node水情点", node);
        if (node.show) {
          if (!allRegimen.value.length) {
            let demo = addChildPoint(regimenDate);
            allRegimen.value.push(demo.value);
          } else {
            allRegimen.value.map((item) => {
              item.map((node) => {
                node.style.opacity = 1;
              });
            });
          }
        } else {
          allRegimen.value.map((item) => {
            item.map((node) => {
              node.style.opacity = 0;
            });
          });
        }
      }
    });
    // allRegimen
  },
  { deep: true }
);
// 测点添加
let addChildPoint = (data) => {
  let measurePoint = ref([]);
  console.log("data", data);
  if (!data.length) return;
  data.forEach((item) => {
    item.children.map(async (node) => {
      let logoback = cedianBack;
      let logo = viewLogo;
      if (node.type == "水情点") {
        logo = regimenLogo;
      }
      let height = await ffCesium.value.getHeightAtPoint([node.lng, node.lat]);
      let lngLatHeight = [node.lng, node.lat, height];
      let htmlLog = `<div onclick='chickxx(${JSON.stringify(
        node
      )})' style='cursor:pointer;width:40px;height:40px;text-align: center; background-image: url(${logoback});background-repeat: no-repeat;background-size: 100% 100%; color: #fff;'>
          <div style='display:inline-block;margin: 10px auto;width:20px;height:20px;line-height:20px;background-image: url(${logo});background-repeat: no-repeat;background-size: 100% 100%;'></div>
          </div>`;
      let offsethtmllogo = { top: 0, left: 0 };
      let htmlStr = ffCesium.value.addHtml(
        lngLatHeight,
        htmlLog,
        offsethtmllogo
      );
      htmlStr.style.zIndex = 98;
      measurePoint.value.push(htmlStr);
    });
  });
  return measurePoint;
};

onMounted(() => {
  // changelayershow();
  // addDemo();
  nextTick(() => {
    showLayer();
    ffCesium.value.getClickModel(callback, nofun); // 点击
    divChick(); //html的点击事件
    // ffCesium.value.getHeight(heightC);//相机高度显示
  });
});

onBeforeUnmount(() => {
  console.log("Component is about to be unmounted");
  zhamen.value.map((htmlOverlay) => {
    ffCesium.value.removeHtml(htmlOverlay);
  });
  allChild.value.map((htmlOverlay) => {
    ffCesium.value.removeHtml(htmlOverlay);
  });
  allRegimen.value.map((htmlOverlay) => {
    ffCesium.value.removeHtml(htmlOverlay);
  });
  // 测点移除
  if (allPoint.value.length) {
    console.log("ffCesium", ffCesium.value);
    allPoint.value.map((htmlOverlay) => {
      nextTick(() => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
    });
    allPoint.value = [];
  }
  //移除简介
  if (allcontent.value.length) {
    allcontent.value.map((htmlOverlay) => {
      nextTick(() => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
    });
    allcontent.value = [];
  }
  // 河流名字
  if (lineName.length) {
    lineName.map((htmlOverlay) => {
      console.log("lineName", htmlOverlay);
      htmlOverlay.map((index) => {
        nextTick(() => {
          ffCesium.value.removeHtml(index);
        });
      });
    });
    lineName = [];
  }
  // 面名字
  if (faceName.length) {
    faceName.map((htmlOverlay) => {
      // htmlOverlay.map((index) => {
      nextTick(() => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      // });
    });
    faceName = [];
  }
  // 模型外框取消选中
  if (allModel.value.length) {
    console.log("allModel.value", allModel.value);
    allModel.value.map((item) => {
      nextTick(() => {
        if (item && !item.isDestroyed()) {
          item.silhouetteSize = 0;
          ffCesium.value.removeFFPrimitive(item);
        }
      });
    });
  }
  //model标签清除
  if (modelList.value.length) {
    modelList.value.map((htmlOverlay) => {
      nextTick(() => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
    });
  }
  modelList.value = [];
});
let zhamen = ref([]);
let allChild = ref([]); //视频点
let allRegimen = ref([]); //水情点
const showLayer = () => {
  layershow.value.map((item) => {
    if (item.name == "工程点") {
      if (item.show) {
        allMonitor(data.value, true);
        ffCesium.value.getHeight(heightC);
        allModelAdd();
      }
    } else if (item.name == "面") {
      if (item.show) {
        palyLine(); //线
      }
    } else if (item.name == "线") {
      if (item.show) {
        playFace(); //面
      }
      // 展示闸控点
    } else if (item.name == "闸控点") {
      if (item.show) {
        allMonitor(zhakongdian, false);
      }
    } else if (item.name == "视频点") {
      if (item.show) {
        let demo = addChildPoint(viewDate);
        allChild.value.push(demo?.value);
      }
    } else if (item.name == "水情点") {
      console.log("4545水情点");

      if (item.show) {
        let demo = addChildPoint(regimenDate);
        allRegimen.value.push(demo.value);
      }
    }
  });
};
// cesium点击事件
const callback = (model) => {
  if (model.primitive && model.primitive.typeValue === "model") {
    console.log("gagag");
    allModel.value.map((item) => {
      if (item.idValue === model.primitive.idValue) {
        // 当前选中
        console.log("item", item);
        item.silhouetteSize = 3;
        item.silhouetteColor = new ffCesium.value.Cesium.Color(1, 1, 0, 1.0);
        let optionModelfly = {
          lng: model.primitive.value.lng,
          lat: model.primitive.value.lat,
          height: model.primitive.value.height,
          distance: 1700,
          pitchRadiu: -25,
          time: 2,
        };
        ffCesium.value.flyTo(optionModelfly, flyCallback);
      } else {
        // 未选中的制空;
        item.silhouetteSize = 0;
      }
    });
  } else {
    // 选别的东西时 模型取消
    allModel.value.map((item) => {
      item.silhouetteSize = 0;
      console.log("modelList.valuebbbbb", modelList.value);

      if (modelList.value.length) {
        modelList.value.map((htmlOverlay) => {
          if (htmlOverlay.FFtype) {
            ffCesium.value.removeFFPrimitive(htmlOverlay);
          } else {
            ffCesium.value.removeHtml(htmlOverlay);
          }
        });
      }
      modelList.value = [];
    });
  }
};
const nofun = () => {
  // 没选中时，模型取消
  allModel.value.map((item) => {
    item.silhouetteSize = 0;
  });
  if (modelList.value.length) {
    modelList.value.map((htmlOverlay) => {
      console.log("htmlOverlay", htmlOverlay);

      if (htmlOverlay.FFtype) {
        ffCesium.value.removeFFPrimitive(htmlOverlay);
      } else {
        ffCesium.value.removeHtml(htmlOverlay);
      }
    });
  }
  modelList.value = [];
};
// all模型添加
const allModelAdd = () => {
  data.value.map((item) => {
    item.children.map((node) => {
      node.children.map((value) => {
        value.children.map((model) => {
          let lngLatHeight = [model.lng, model.lat, model.height];
          addMODEL(lngLatHeight, model);
        });
      });
    });
  });
};
let allModel: object = ref([]);
// 添加model
const addMODEL = (lngLatHeight, value) => {
  let optionModel = {
    url: value.url,
    headingAngle: -0, //y
    pitchAngle: 0, //x
    rollAngle: 0,
    minimumPixelSize: 128,
    maximumScale: 128,
  };
  let promise = ffCesium.value.addGltfPrimitive(lngLatHeight, optionModel);
  console.log("promise", promise);
  promise.then((result) => {
    result.typeValue = "model";
    result.idValue = value.id;
    result.value = value;
    allModel.value.push(result);
  });
};
let allcontentzhakong: object = ref([]); //闸门介绍
let allcontent: object = ref([]); //工程介绍
// let zmChick: object = ref([]); //闸门介绍
// let gongcChick: object = ref([]); //工程介绍
// html点击事件
const divChick = () => {
  window["showContent"] = (valueParam) => {
    showContent(valueParam);
  };
  const showContent = (valueParam) => {
    console.log("valueParam", valueParam);

    let lngLatHeight = [valueParam.lng, valueParam.lat, valueParam.height];
    let me = null;
    if (valueParam.type == "闸控点") {
      me = zhamenHtml(lngLatHeight, valueParam);
      console.log("me", me.value);

      !allcontentzhakong.value.includes(...me.value)
        ? allcontentzhakong.value.push(...me.value)
        : null;
      console.log("allcontentzhakong", allcontentzhakong.value);
    } else if (valueParam.type == "engineering") {
      if (!me) {
        me = contentHtml(lngLatHeight, valueParam);
        !allcontent.value.includes(...me.value)
          ? allcontent.value.push(...me.value)
          : null;
      }
    }
  };
  window["off"] = (valueParam) => {
    off(valueParam);
  };
  const off = (valueParam) => {
    allcontent.value.map((item, index) => {
      if (item.gagag == valueParam.id) {
        ffCesium.value.removeHtml(item);
        allcontent.value.splice(index, 1);
      }
    });
    allcontentzhakong.value.map((item, index) => {
      if (item.gagag == valueParam.id) {
        ffCesium.value.removeHtml(item);
        allcontentzhakong.value.splice(index, 1);
      }
    });
  };
};

// 添加工程
const allMonitor = (data, show) => {
  data.forEach((item) => {
    item.children.map((node) => {
      // let heightmap = await ffCesium.value.getHeightAtPoint([
      //   node.lng,
      //   node.lat,
      // ]);
      let lngLatHeight = [node.lng, node.lat, node.height];
      let heightlog = 0;
      let height = 12;
      if (show) {
        height = 146;
        heightlog = 134;
      }

      let logo = null; //工程类型
      let logoback = null;
      let line = null;
      let bottom = null;
      let title = null;
      let lineWidth = "2px";
      // 测点类型
      if (node.type == "闸控点") {
        logo = engineeringBLogo;
        if (node.state == "ok") {
          // console.log("工程状态,决定颜色,logoback,title");
          logoback = engineerPintBback;
          title = engineeringBtitle;
          line = engineerPintBLine;
          bottom = engineerPintBbottom;
        } else if (node.state == "off") {
          title = engineeringRtitle;
          logoback = engineeringRBack;
          line = engineeringRLine;
          bottom = engineeringRbottom;
        }
        // 工程 dong
      } else if (node.type == "engineering") {
        logo = shuikuLogo;
        lineWidth = "60px";
        if (node.state == "ok") {
          // console.log("工程状态,决定颜色,logoback,title");
          title = engineeringBtitle;
          logoback = engineeringBBack;
          line = engineeringBLine;
          bottom = engineeringBbottom;
        } else if (node.state == "off") {
          title = engineeringRtitle;
          logoback = engineeringRBack;
          line = engineeringRLine;
          bottom = engineeringRbottom;
        }
      }
      let option = {
        htmlStr: `<div onclick='showContent(${JSON.stringify(
          node
        )})' style='cursor:pointer;width:124px;height:30px;background-image:
         url(${title});background-repeat: no-repeat;background-size: 100% 100%; color: #fff;
          text-align: center; '>
          <div style='padding-top:3px;padding-left:20px'>${
            node.label
          }</div></div>`,
        htmlLog: `<div onclick='showContent(${JSON.stringify(
          node
        )})' style='cursor:pointer;width:55px;height:55px;text-align: center; background-image: url(${logoback});background-repeat: no-repeat;background-size: 100% 100%; color: #fff;'>
        <div style='display:inline-block;margin: 17px auto;width:20px;height:20px;line-height:20px;background-image: url(${logo});background-repeat: no-repeat;background-size: 100% 100%;'></div>
        </div>`,
        // 60
        htmlLine: `<div style='cursor:pointer;width:${lineWidth};height:125px;background-image: url(${line});background-repeat: no-repeat;background-size: 100% 100%;text-align: center; '></div>`,
        htmlPoint: `<div style='cursor:pointer;width:50px;height:50px;background-image: url(${bottom});background-repeat: no-repeat;background-size: 100% 100%; color: #fff; text-align: center; '></div>`,
        offsethtmlStr: { top: height, left: -45 },
        offsethtmllogo: { top: heightlog, left: 0 },
        offsetLine: { top: 20, left: 0 },
        offset: { top: 0, left: 0 },
        showName: node.label,
        showtype: node.showtype,
      };
      const { htmlStr, htmllogo, htmlLine, htmlPoint } = addHtml(
        lngLatHeight,
        option,
        show
      );

      return { htmlStr, htmllogo, htmlLine, htmlPoint };
    });
  });
};
const addDemo = async () => {
  let height = await ffCesium.value.getHeightAtPoint([
    129.76437662344546, 46.6849432232373,
  ]);
  let lngLatHeight = [129.76437662344546, 46.6849432232373, height];
  let offset = { top: 10, left: 0 };
  let htmlOverlay = document.getElementById("tooltip-view");
  htmlOverlay.lngLatHeight = lngLatHeight;
  let abc = ffCesium.value.addHtmlForVue(lngLatHeight, htmlOverlay, offset);
  abc.style.zIndex = 999;
};

let allPoint: object = ref([]);
let twoHtml: object = ref([]);
// let twoHtml: object = ref([]);
// 添加添加工程
const addHtml = (lngLatHeight, option, show) => {
  let htmlStr = null;
  let htmlLine = null;
  let htmlPoint = null;
  // 名称
  if (option.showName) {
    htmlStr = ffCesium.value.addHtml(
      lngLatHeight,
      option.htmlStr,
      option.offsethtmlStr
    );
    htmlStr.style.zIndex = 999;
  }
  //logo
  let htmllogo = ffCesium.value.addHtml(
    lngLatHeight,
    option.htmlLog,
    option.offsethtmllogo
  );
  htmllogo.style.zIndex = 99;
  // 是否展示高线
  if (show) {
    htmlLine = ffCesium.value.addHtml(
      lngLatHeight,
      option.htmlLine,
      option.offsetLine
    );
    htmlLine.style.zIndex = 99;
    //底座点
    htmlPoint = ffCesium.value.addHtml(
      lngLatHeight,
      option.htmlPoint,
      option.offset
    );
    htmlPoint.style.zIndex = 99;
  }
  // 线;
  if (option.showtype && option.showtype == "2") {
    if (htmlStr) {
      twoHtml.value.push(htmlStr);
    }
    twoHtml.value.push(htmllogo);
    htmlLine !== null ? twoHtml.value.push(htmlLine) : null;
    htmlPoint !== null ? twoHtml.value.push(htmlPoint) : null;
    // twoHtml.value.push(htmlLine);
    // twoHtml.value.push(htmlPoint);
    twoHtml.value.forEach((element) => {
      element.style.opacity = 0; //隐藏
    });
  }
  // 闸点
  // console.log("展示高线option.showtype", option.showtype);
  if (option.showtype) {
    if (htmlStr) {
      zhamen.value.push(htmlStr);
    }
    zhamen.value.push(htmllogo);
    htmlLine !== null ? zhamen.value.push(htmlLine) : "kong";
    htmlPoint !== null ? zhamen.value.push(htmlPoint) : null;
    // zhamen.value.push(htmlLine);
    // zhamen.value.push(htmlPoint);
    // if (!show) {
    //   zhamen.value.push("5");
    // }
  } else {
    console.log("工程点");
    if (htmlStr) {
      allPoint.value.push(htmlStr);
    }

    allPoint.value.push(htmllogo);
    htmlLine !== null ? allPoint.value.push(htmlLine) : null;
    htmlPoint !== null ? allPoint.value.push(htmlPoint) : null;
    // allPoint.value.push(htmlLine);
    // allPoint.value.push(htmlPoint);
  }
  return { htmlStr, htmllogo, htmlLine, htmlPoint };
};

// 添加介绍div
// let allcontentzhakong: object = ref([]); //闸门介绍
// let allcontent: object = ref([]); //工程介绍
const addHtmlFun = (data) => {
  let dataTemp = ref([]);
  data.map((da) => {
    da.children.map((item) => {
      dataTemp.value.push(item);
      // let height = await ffCesium.value.getHeightAtPoint([node.lng, node.lat]);
      let lngLatHeight = [item.lng, item.lat, item.height];
      if (item.type == "闸控点") {
        let abc = zhamenHtml(lngLatHeight, item);
        allcontentzhakong.value.push(...abc.value);
      } else if (item.type == "engineering") {
        let aaa = contentHtml(lngLatHeight, item);
        allcontent.value.push(...aaa.value);
      }
    });
  });
  return { allcontentzhakong, allcontent };
};
const contentHtml = (lngLatHeight, item) => {
  let content: object = ref([]); //工程介绍
  let offset = { top: 32, left: -115 };
  let htmlCan = `
  <div style=' background-color: rgba(15, 27, 41, 0.8); z-index: 99; width: 200px;  height: 110px;color: white' >
    <div style='height: 25px; background-image: url(/public/img/mapServer/popBack.png);background-repeat: no-repeat;background-size: 100% 100%; '>
      <div style='height: 25px; link-height:25px;padding-left:20px'>
        <samp style='width: 50px'> 站点详情</samp>
        <samp style='width: 40px; padding-left:98px' onclick='off(${JSON.stringify(
          item
        )})'><img style='width: 12px;' src="/public/img/mapServer/popOff.png" alt=""></samp>
      </div>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 所属工程:</samp>
      <samp style='color: aqua'>${item.titile}</samp>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 名称:</samp>
      <samp style='color: aqua'>${item.data.bute}</samp>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 设备状态:</samp>
      <samp style='color: aqua'>${item.data.type}</samp>
    </div>
      </div>`;

  let con = ffCesium.value.addHtml(lngLatHeight, htmlCan, offset);
  content.value.push(con);
  // allcontent.value.push(con);
  con.gagag = item.id;
  item.htmlId = con;
  con.style.zIndex = 99;
  return content;
};

const zhamenHtml = (lngLatHeight, item) => {
  let content: object = ref([]); //工程介绍
  console.log("item", item);
  let offset = { top: 32, left: -115 };
  let htmlCan = `
  <div style=' background-color: rgba(15, 27, 41, 0.8); z-index: 99; width: 200px;  height: 110px;color: white' >
    <div style='height: 25px; background-image: url(/public/img/mapServer/popBack.png);background-repeat: no-repeat;background-size: 100% 100%; '>
      <div style='height: 25px; link-height:25px;padding-left:20px'>
        <samp style='width: 50px'> 闸控点详情</samp>
        <samp style='width: 40px; padding-left:98px' onclick='off(${JSON.stringify(
          item
        )})'><img style='width: 12px;' src="/public/img/mapServer/popOff.png" alt=""></samp>
      </div>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 所属工程:</samp>
      <samp style='color: aqua'>${item.label}</samp>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 流速:</samp>
      <samp style='color: aqua'>${item.speed}</samp>
    </div>
    <div style='padding-top:3px;padding-left:20px'>
      <samp style='width: 50px'> 设备状态:</samp>
      <samp style='color: aqua'>${item.state}</samp>
    </div>
      </div>`;
  let con = ffCesium.value.addHtml(lngLatHeight, htmlCan, offset);
  content.value.push(con);
  con.gagag = item.id;
  item.htmlId = con;
  con.style.zIndex = 99;
  return content;
};
// 添加模型标签
let modelList = ref([]);
const ALLModel = () => {
  data.value.map((item) => {
    item.children.map((node) => {
      node.children.map((value) => {
        value.children.map((model) => {
          let lngLatHeight = [model.lng, model.lat, model.height];
          let offset = { top: 100, left: 0 };
          let htmlmodel =
            "<div  style='cursor:pointer;width:124px;height:30px;background-image: url(/public/img/mapServer/modelBack.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '><div style='padding-top:3px;'>" +
            model.label +
            "</div><div style='width: 20px; padding-top:30px; margin-left:49px; margin-top:12px; background-image: url(/public/img/mapServer/modelPoint.png);background-repeat: no-repeat;'>";
          ("</div></div>");
          let ooo = ffCesium.value.addHtml(lngLatHeight, htmlmodel, offset);
          ooo.style.zIndex = 99;
          modelList.value.push(ooo);
        });
      });
    });
  });
};
let showqingchu = false; //true时会变高 false取消高度
const heightC = (value) => {
  if (value > 6000) {
    // if (value < 15000) {
    //   twoHtml.value.map((item) => {
    //     item.style.opacity = 1;
    //   });
    // } else {
    //   twoHtml.value.map((item) => {
    //     item.style.opacity = 0;
    //   });
    // }

    if (!allPoint.value.length) {
      console.log("123");
      allMonitor(data.value, true);
      // allMonitor(zhakongdian, false);
    }

    // 简介
    if (allcontent.value.length) {
      allcontent.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allcontent.value = [];
    }
    if (modelList.value.length) {
      modelList.value.map((htmlOverlay) => {
        if (htmlOverlay.FFtype) {
          ffCesium.value.removeFFPrimitive(htmlOverlay);
        } else {
          ffCesium.value.removeHtml(htmlOverlay);
        }
      });
    }
    modelList.value = [];
    // 模型取消选中
    allModel.value.map((item) => {
      item.silhouetteSize = 0;
    });
    if (allcontentzhakong.value.length) {
      allcontentzhakong.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allcontentzhakong.value = [];
    }
    if (showqingchu) {
      //  allcontentzhakong
      if (allcontentzhakong.value.length) {
        allcontentzhakong.value.map((htmlOverlay) => {
          // htmlOverlay.style.opacity = 0;
          ffCesium.value.removeHtml(htmlOverlay);
        });
        allcontentzhakong.value = [];
      }

      zhamen.value.map((htmlOverlay) => {
        console.log("别高了", value);
        ffCesium.value.removeHtml(htmlOverlay);
      });
      zhamen.value = [];
      allMonitor(zhakongdian, false);
      showqingchu = false;
    }
  }
  if (value < 6500 && value > 3400) {
    // if (zhamen.value.length) {
    if (!showqingchu) {
      zhamen.value.map((htmlOverlay) => {
        console.log("高起来好嘛", value);
        ffCesium.value.removeHtml(htmlOverlay);
      });
      zhamen.value = [];
      showqingchu = true;
      allMonitor(zhakongdian, true);
      // 二级出现
      twoHtml.value.map((item) => {
        item.style.opacity = 1;
      });
      // 简介弹出
      addHtmlFun(zhakongdian);
    }
    // }
    // 工程点
    allPoint.value.map((htmlOverlay) => {
      ffCesium.value.removeHtml(htmlOverlay);
    });
    allPoint.value = [];
    // 介绍
    if (!allcontent.value.length) {
      addHtmlFun(data.value);
    }
    if (modelList.value.length) {
      //model标签清除
      modelList.value.map((htmlOverlay) => {
        // if (htmlOverlay.FFtype) {
        //   ffCesium.value.removeFFPrimitive(htmlOverlay);
        // } else {
        ffCesium.value.removeHtml(htmlOverlay);
        // }
      });
    }
    modelList.value = [];
    // 模型取消选中
    allModel.value.map((item) => {
      item.silhouetteSize = 0;
    });
  }
  if (value < 3400 && value > 1400) {
    // console.log("第三级", value);
    // 模型外框取消选中
    allModel.value.map((item) => {
      item.silhouetteSize = 0;
    });

    // 测点
    if (allPoint.value.length) {
      allPoint.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allPoint.value = [];
    }
    //移除简介
    peopleArr.value = [];
    if (allcontent.value.length) {
      allcontent.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allcontent.value = [];
    }

    // 模型标签
    // //model标签清除
    // if (modelList.value.length) {
    //   modelList.value.map((htmlOverlay) => {
    //     if (htmlOverlay.FFtype) {
    //       ffCesium.value.removeFFPrimitive(htmlOverlay);
    //     } else {
    //       ffCesium.value.removeHtml(htmlOverlay);
    //     }
    //   });
    // }
    // modelList.value = [];
    if (!modelList.value.length) {
      ALLModel();
    }
  }
  if (value < 1400) {
    console.log("第四级", value);
    // 测点
    if (allPoint.value.length) {
      allPoint.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allPoint.value = [];
    }
    //移除简介
    peopleArr.value = [];
    if (allcontent.value.length) {
      allcontent.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allcontent.value = [];
    }

    //model标签清除
    // if (modelList.value.length) {
    //   modelList.value.map((htmlOverlay) => {
    //     if (htmlOverlay.FFtype) {
    //       ffCesium.value.removeFFPrimitive(htmlOverlay);
    //     } else {
    //       ffCesium.value.removeHtml(htmlOverlay);
    //     }
    //   });
    // }
    // modelList.value = [];
    // 模型标签
    if (!modelList.value.length) {
      ALLModel();
    }
  }
};
let linearr = [
  {
    name: "老狼河",
    showname: true,
    ZB: "129.85324708449923,46.71345670981228;129.8529895924338,46.714251173415306;129.84994260299288,46.71345670981228;129.84711019027316,46.72087124861383;129.84105912673553,46.7209889314918;129.83826962936007,46.72540185411853;129.83556596267306,46.727166922098405;129.8284420155295,46.730226236449795;129.82522336471152,46.732579437106665",
  },
  {
    name: "永久河",
    showname: true,
    ZB: "129.8251804493673,46.7165168016754;129.81814233291223,46.712632809278006;129.81264916884973,46.7131036111235;129.79891625869348,46.7099256189629;129.79170648086145,46.70662972573325;129.78741494643762,46.70545257223594;129.78501168716028,46.70674743967115;129.77642861831265,46.70074370154808;129.77522698867395,46.69732951347072;129.76612893569543,46.69379736758842;129.76046411025598,46.68484823067803",
  },
];

const palyLine = () => {
  linearr.map((item) => {
    addLine(item);
  });
};
// 线
let lineName = [];
const addLine = (value) => {
  let newPoint = changeaddress(value.ZB);
  let option = {
    width: 3,
    color: "#58D4DE",
    alpha: 1,
  };
  ffCesium.value.addPolylinePrimitive(newPoint, option);
  if (value.showname) {
    let optionWord = {
      label: value.name,
      styleStr:
        "cursor:pointer;color: white;padding: 2px;border-radius: 5px;font-weight: bold;",
      offset: { top: 0, left: 0 },
      height: 100,
    };
    let labelArr1 = ffCesium.value.addLineSegmentLabel(newPoint, optionWord);
    labelArr1.map((item) => {
      item.style.zIndex = 99;
    });
    lineName.push(labelArr1);
  }
};
// 坐标转化
const changeaddress = (data) => {
  let lnglatArr = data.split(";");
  let pointArr = [];
  lnglatArr.map((item) => {
    let arr = item.split(",");
    arr[0] = parseFloat(arr[0]);
    arr[1] = parseFloat(arr[1]);
    arr[2] = 120;
    pointArr.push(arr);
  });
  return pointArr;
};
let faceAll = [
  {
    name: "不知名水库",
    showname: true,
    ZB: "129.81818524825653,46.71603131791301;129.81799212920745,46.71557525343019;129.81717673766693,46.71539871130528;129.8166832112082,46.715516406119406;129.8166832112082,46.71576650674709;129.81669662225332,46.716011089328134;129.81658933389272,46.716047868567756;129.81686828363027,46.716143494473414;129.81670735108938,46.71626118766315;129.81693265664663,46.716275899293805;129.81706140267934,46.71635681319077;129.81710431802355,46.71624647602846;129.8172330640563,46.71633474577638;129.81750128495779,46.71620234110037;129.81783387887563,46.71630532254312;129.81803772676076,46.71616556196602",
  },
  {
    name: "不知名水库2",
    showname: true,
    ZB: "129.83531115281673,46.71243602760208;129.83560083139037,46.71263464835573;129.8358583234558,46.71251694725663;129.8359656118164,46.71284062466148;129.83627674806212,46.71265671728324;129.83640549409483,46.71307602519113;129.8366951726684,46.71313487516312;129.83695266473387,46.713642453507816;129.83678100335692,46.71372337135344;129.83696339356993,46.71403968540403;129.83668444383238,46.71505482029954;129.83532963773703,46.71592141315335;129.83440695783588,46.716186223559134;129.83380614301657,46.7160538185187;129.83286200544333,46.71631862827468;129.83228264829611,46.716097953568266;129.83211098691916,46.71634805150066;129.83120976469016,46.716083241889066;129.82852755567527,46.7160538185187;129.82809840223288,46.716097953568266;129.82827006360984,46.71489158255548;129.8306947805593,46.714097128380274;129.8318320371816,46.71397943047077;129.83296929380393,46.71317025039397;129.83421383878684,46.712802437257295;129.83481465360614,46.71274358692284;129.83505873462656,46.712815310759424;129.83509092113474,46.713146342616284;129.83492998859387,46.71331185778325;129.8350265481184,46.71331553589232;129.83513383647897,46.71344426955133;129.83538059970837,46.713484728637894;129.83552007457712,46.71341116663979;129.8357292868803,46.71345530385071;129.83564345619183,46.713767941394565;129.8355683543394,46.714054830723626;129.83568637153607,46.71405850878202;129.83586339733105,46.713764263316335;129.83585266849497,46.71349944102553;129.83578293106058,46.71328978912365;129.83577220222452,46.71317944569029;129.8354825236509,46.71298450507331;129.83533231994608,46.712885195431625;129.83526794692975,46.71256887461425;129.83519820949536,46.712473242374244;129.8352464892576,46.71241071351031",
  },
];
const playFace = () => {
  faceAll.map((item) => {
    addFace(item);
  });
};
let faceName = [];
const addFace = (value) => {
  let lnglatArr = changeTwoARR(value.ZB);
  let option = {
    color: "#FFFF00",
    alpha: 1,
    extrudedHeight: 130,
    // perPositionHeight: true,
  };
  let abc = ffCesium.value.addPolygonEntity(lnglatArr, option);
  // let abc = ffCesium.value.addPolygonPrimitive(lnglatArr, option);

  // abc.extrudedHeight = 200;
  console.log("centroidlnglatArr", abc);
  let nameValue = {
    name: value.name,
    styleStr: "color: #FFF;font-size: 12px;",
    offset: { top: 0, left: 0 },
    height: 10,
  };
  // 名
  let addFaceLabel = ffCesium.value.addFaceLabel(lnglatArr, nameValue);
  faceName.push(addFaceLabel);
};
const changeTwoARR = (data) => {
  let lnglatArr = data.split(";");
  let pointArr = [];
  lnglatArr.map((item) => {
    let arr = item.split(",");
    arr[0] = parseFloat(arr[0]);
    arr[1] = parseFloat(arr[1]);
    // arr[2] = 130;
    pointArr.push(arr);
  });
  return pointArr;
};
</script>
<style lang="scss" scoped>
.box {
  position: absolute;
  top: 30px;
  left: 450px;
  z-index: 999;
}
.cesium-popup-background {
  width: 50px;
  height: 30px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
}
</style>
