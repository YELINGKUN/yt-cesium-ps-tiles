<template>
  <div class="box">
    <!-- <el-tree
      style="max-width: 600px"
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
    /> -->
  </div>
  <!-- <div
    v-for="(item, key) in peopleArr"
    class="content"
    :id="item.id"
    style="z-index: 99; background-color: rgba(15, 27, 41, 0.8)"
  >
    <div>
      <samp style="width: 50px">所属工程：</samp>
      <samp style="color: aqua">{{ item.label }}</samp>
    </div>
    <div>
      <samp style="width: 500px">名称：</samp>
      <samp style="color: aqua">{{ item.data.bute }}</samp>
    </div>
    <div>
      <samp style="width: 500px">状态：</samp>
      <samp style="color: aqua">{{ item.data.type }}</samp>
    </div>
    <div>
      <samp style="width: 500px">更新时间：</samp>
      <samp style="color: aqua">{{ item.data.time }}</samp>
    </div>
  </div> -->

  <!-- <div
    style="
      cursor: pointer;
      width: 50px;
      height: 50px;
      background-image: url(/public/img/mapServer/point.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
      text-align: center;
    "
  ></div> -->
</template>
<script lang="ts" setup>
import {
  onMounted,
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
});
const ffCesium = computed(() => {
  return props.ffCesium;
});
// console.log("123123ffcesium", ffCesium.value);
// watch(
//   () => ffCesium.value,
//   (newVal, oldVal) => {
//     console.log("newVal", newVal);
//     console.log("oldVal", oldVal);
//   },
//   { immediate: true }
// );
// 全部数据列表
const data = ref([
  {
    label: "大站点1",
    lng: 129.85897571573392,
    lat: 46.68706812460703,
    height: 60000,
    Camaralength: 5500,
    children: [
      {
        label: "分站1-1",
        id: "div3501", //唯一值
        lng: 129.8607663324511,
        lat: 46.710408594917055,
        height: 0, //第一个点离地高度
        Camaralength: 2500, //线点高
        image: "/public/img/mapServer/typeLogo.png",
        titile: "标题",
        data: { bute: "1流域1", type: "在线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "xx设备1",
            lng: 129.86027817041048,
            lat: 46.70988627278922,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "闸门31",
                id: "model11",
                url: "/public/model/zhamen1.glb",
                lng: 129.85527817041048,
                lat: 46.70988627278922,
                height: 100, //第一个点离地高度
                Camaralength: 0,
                headingAngle: -0, //模型的方向
              },
              {
                label: "闸门31",
                id: "model12",
                url: "/public/model/zhamen1.glb",
                lng: 129.8611311128772,
                lat: 46.70953315074044,
                height: 100, //第一个点离地高度
                Camaralength: 0,
                headingAngle: -0, //模型的方向
              },
            ],
          },
          // {
          //   label: "xx设备2",
          //   lng: 126.901392,
          //   lat: 46.120809,
          //   height: 0, //第一个点离地高度
          //   children: [
          //     {
          //       label: "闸门31",
          //       id: "model121",
          //       url: "/public/model/zhamen1.glb",
          //       lng: 126.901392,
          //       lat: 46.120809,
          //       height: 0, //第一个点离地高度
          // Camaralength: 0,
          //     },
          //     {
          //       label: "闸门31",
          //       id: "model122",
          //       url: "/public/model/zhamen1.glb",
          //       lng: 126.931392,
          //       lat: 46.120809,
          //       height: 0, //第一个点离地高度
          //     },
          //   ],
          // },
        ],
      },
      {
        label: "分站1-2",
        id: "div3502",
        lng: 129.8978688219228,
        lat: 46.68141644163751,
        height: 0, //第一个点离地高度
        Camaralength: 2500,
        image: "/public/img/mapServer/typeLogo.png",
        titile: "标题",
        data: { bute: "1流域222", type: "在线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "11111xx设备2",
            id: "model3",
            url: "/public/model/zhamen1.glb",
            lng: 129.8678688219228,
            lat: 46.68141644163751,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "设备21",
                id: "model221",
                url: "/public/model/zhamen1.glb",
                lng: 129.89857045156147,
                lat: 46.68141644163751,
                headingAngle: -8, //模型的方向
                Camaralength: 0,
                height: 100, //第一个点离地高度
              },
              {
                Camaralength: 0,
                label: "设备212",
                id: "model222",
                url: "/public/model/zhamen1.glb",
                lng: 129.89991843701973,
                lat: 46.68541644163751,
                headingAngle: -10, //模型的方向
                height: 100, //第一个点离地高度
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "大站点2",
    lng: 129.8153189829028,
    lat: 46.668786855226425,
    height: 60000,
    Camaralength: 5500,
    children: [
      {
        label: "分站1-1",
        id: "div201", //唯一
        lng: 129.8053189829028,
        lat: 46.686786855226425,
        height: 0, //第一个点离地高度
        Camaralength: 2500,
        image: "/public/img/mapServer/typeLogo.png",
        // showtitle: false, //是否显示介绍
        titile: "标题",
        data: { bute: "2222流域1", type: "离线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "1111xx设备2",
            lng: 129.8153189829028,
            lat: 46.688786855226425,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "设备21",
                id: "model21",
                url: "/public/model/zhamen1.glb",
                lng: 129.81264719491512,
                lat: 46.6877372418536,
                Camaralength: 0,
                height: 55, //第一个点离地高度
                headingAngle: -0, //模型的方向
              },
              {
                Camaralength: 0,
                label: "设备21",
                id: "model22",
                url: "/public/model/zhamen1.glb",
                lng: 129.8188806486657,
                lat: 46.68852472440392,
                height: 55, //第一个点离地高度
                headingAngle: -0, //模型的方向
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "大站点",
    lng: 129.68840999436603,
    lat: 46.65964931855072,
    height: 50000,
    Camaralength: 5500,
    children: [
      {
        Camaralength: 2500,
        label: "分站1-1",
        id: "div101",
        lng: 129.69440999436603,
        lat: 46.68257303585382,
        height: 0, //第一个点离地高度
        linelength: 2000, //线点高
        image: "/public/img/mapServer/typeLogo.png",
        // showtitle: false, //是否显示介绍
        titile: "3333333",
        data: { bute: "33333流域1", type: "离线", time: "2024/8/7" }, //标签需要的值
        children: [
          {
            label: "闸门类",
            lng: 129.69493312669024,
            lat: 46.6857303585382,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                Camaralength: 0,
                label: "闸门31",
                id: "model31",
                url: "/public/model/zhamen1.glb",
                lng: 129.69493312669024,
                lat: 46.68635218740141,
                height: 100, //第一个点离地高度
                headingAngle: -0, //模型的方向
              },
              {
                Camaralength: 0,
                label: "3333xx设备2",
                id: "model32",
                url: "/public/model/zhamen1.glb",
                lng: 129.70317934256167,
                lat: 46.68729839888073,
                height: 100, //第一个点离地高度
                headingAngle: -0, //模型的方向
              },
              {
                Camaralength: 0,
                label: "3333xx设备3",
                id: "model33",
                url: "/public/model/zhamen1.glb",
                lng: 129.68524072867007,
                lat: 46.68155747835286,
                height: 100, //第一个点离地高度
                headingAngle: -0, //模型的方向
              },
            ],
          },
        ],
      },
    ],
  },
]);
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
onMounted(() => {
  nextTick(() => {
    allMonitor(false);
    // addHtmlFun();
    // model
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
    // 点击
    ffCesium.value.getClickModel(callback, nofun);
    divChick(); //html的点击事件
    ffCesium.value.getHeight(heightC);
  });
});
const callback = (model) => {
  if (model.primitive && model.primitive.typeValue === "model") {
    allModel.value.map((item) => {
      if (item.idValue === model.primitive.idValue) {
        // 当前选中
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
        // 选中前先把之前的标签去掉
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
        // 高度检索
        // flyCallback();

        // 添加标签
        // if (!modelList.value.length) {
        //   console.log("dianji");

        //   let offset = { top: 0, left: -57 };
        //   modelContent(model.primitive.value, offset);
        // }
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
let allModel: object = ref([]);
// 添加model
const addMODEL = (lngLatHeight, value) => {
  // console.log("value", value);

  let optionModel = {
    url: value.url,
    headingAngle: value.headingAngle, //y
    // headingAngle: -0, //y
    pitchAngle: 0, //x
    rollAngle: 0,
    minimumPixelSize: 128,
    maximumScale: 128,
  };
  let promise = ffCesium.value.addGltfPrimitive(lngLatHeight, optionModel);
  // console.log("promise", promise);
  promise.then((result) => {
    result.typeValue = "model";
    result.idValue = value.id;
    result.value = value;
    allModel.value.push(result);
  });
};
const divChick = () => {
  window["showContent"] = (valueParam) => {
    showContent(valueParam);
  };
  const showContent = (valueParam) => {
    console.log("11111", valueParam);
    let lngLatHeight = [valueParam.lng, valueParam.lat, valueParam.height];
    let me = null;
    if (!me) {
      me = contentHtml(lngLatHeight, valueParam);
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

    // addHtmlFun();
  };
};
let allPoint: object = ref([]);
// 添加测点标题
const allMonitor = (show) => {
  data.value.forEach((item) => {
    item.children.map((node) => {
      let lngLatHeight = [node.lng, node.lat, node.height];
      // let height = 10;
      // let heightlog = 0;
      // if (show) {
      let height = 148;
      let heightlog = 139;
      // }
      let option = {
        htmlStr:
          "<div onclick='showContent(" +
          JSON.stringify(node) +
          ")'  style='cursor:pointer;width:124px;height:30px;background-image: url(/public/img/mapServer/button.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '><div style='padding-top:3px;padding-left:20px'>" +
          item.label +
          "</div></div>",
        htmlLog:
          "<div onclick='showContent(" +
          JSON.stringify(node) +
          ")' style='cursor:pointer;width:50px;height:50px;background-image: url(/public/img/mapServer/typeLogo.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '></div>",
        htmlLine:
          "<div style='cursor:pointer;width:60px;height:125px;background-image: url(/public/img/mapServer/iSpt2.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '></div>",
        htmlPoint:
          "<div style='cursor:pointer;width:50px;height:50px;background-image: url(/public/img/mapServer/point.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '></div>",
        offsethtmlStr: { top: height, left: -45 },
        offsethtmllogo: { top: heightlog, left: 0 },
        offsetLine: { top: 20, left: 0 },
        offset: { top: 0, left: 0 },
      };
      addHtml(lngLatHeight, option, show);
    });
  });
};
// 添加测点
const addHtml = (lngLatHeight, option, show) => {
  let htmlStr = ffCesium.value.addHtml(
    lngLatHeight,
    option.htmlStr,
    option.offsethtmlStr
  );
  let logo = ffCesium.value.addHtml(
    lngLatHeight,
    option.htmlLog,
    option.offsethtmllogo
  );
  allPoint.value.push(htmlStr);
  allPoint.value.push(logo);
  // if (show) {
  // 线;
  let htmlLine = ffCesium.value.addHtml(
    lngLatHeight,
    option.htmlLine,
    option.offsetLine
  );
  //底座点
  let htmlPoint = ffCesium.value.addHtml(
    lngLatHeight,
    option.htmlPoint,
    option.offset
  );
  allPoint.value.push(htmlLine);
  allPoint.value.push(htmlPoint);
  // }

  allPoint.value.forEach((element) => {
    element.style.zIndex = 99;
  });
};

let allHtmlOverlay = ref([]);
// 添加介绍div
let allcontent: object = ref([]);
const addHtmlFun = () => {
  let dataTemp = ref([]);
  data.value.map((da) => {
    da.children.map((item) => {
      dataTemp.value.push(item);
      let lngLatHeight = [item.lng, item.lat, item.height];
      let con = contentHtml(lngLatHeight, item);
      // allcontent.value.push(con);
    });
  });
};
const contentHtml = (lngLatHeight, item) => {
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
  allcontent.value.push(con);
  con.gagag = item.id;
  console.log("item", item);

  item.htmlId = con;
  console.log("item22222", item);
  con.style.zIndex = 99;
  return con;
};
// const addHtmlFun = () => {
//   let dataTemp = ref([]);
//   data.value.map((item) => {
//     item.children.map((item) => {
//       dataTemp.value.push(item);
//     });
//   });
//   peopleArr.value = dataTemp.value;
//   nextTick(() => {
//     console.log("html");
//     peopleArr.value.forEach((element) => {
//       let lngLatHeight = [element.lng, element.lat, element.height];
//       let offset = { top: 20, left: -110 };
//       let htmlOverlay = document.getElementById(element.id);
//       htmlOverlay.lngLatHeight = lngLatHeight;
//       console.log();

//       ffCesium.value.addHtmlForVue(lngLatHeight, htmlOverlay, offset);
//       allHtmlOverlay.value.push(htmlOverlay);
//     });
//   });
//   let option = {
//     opacity: 0,
//   };
//   //碰撞
//   // ffCesium.value.openDivCollisionChecking(allHtmlOverlay, option);
// };
// 添加模型标线
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

const modelContent = (model, offset) => {
  let lngLatHeight = [model.lng, model.lat, model.height];
  let htmlmodel =
    "<div  style='cursor:pointer;width:124px;height:30px;background-image: url(/public/img/mapServer/background.png);background-repeat: no-repeat;background-size: 100% 100%; color: #fff;   text-align: center; '><div style='padding-top:3px;'>" +
    model.label +
    "</div></div>";
  let { htm, line } = ffCesium.value.addLabel(lngLatHeight, htmlmodel, offset);
  modelList.value.push(htm);
  modelList.value.push(line);
};

const defaultProps = {
  children: "children",
  label: "label",
};
const heightC = (value) => {
  console.log("10000", value);
  // if (value > 15000) {
  //   allPoint.value.map((htmlOverlay) => {
  //     ffCesium.value.removeHtml(htmlOverlay);
  //   });
  //   allPoint.value = [];
  //   if (!allPoint.value.length) {
  //     allMonitor(false);
  //   }
  // } else {
  //   console.log("高起来哦");
  //   allPoint.value.map((htmlOverlay) => {
  //     ffCesium.value.removeHtml(htmlOverlay);
  //   });
  //   allPoint.value = [];

  //   if (!allPoint.value.length) {
  //     allMonitor(true);
  //   }
  // }
  if (value > 6000) {
    // if (value > 6000 && value < 15000) {
    // console.log("6000");
    // allPoint.value.map((htmlOverlay) => {
    //   ffCesium.value.removeHtml(htmlOverlay);
    // });
    // allPoint.value = [];

    if (!allPoint.value.length) {
      allMonitor(true);
    }

    // 简介
    if (allcontent.value.length) {
      allcontent.value.map((htmlOverlay) => {
        ffCesium.value.removeHtml(htmlOverlay);
      });
      allcontent.value = [];
    }
    // if (!allcontent.value.length) {
    //   addHtmlFun();
    // }
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
  }
  if (value < 6500 && value > 3400) {
    // 测点
    console.log("22222", value);
    allPoint.value.map((htmlOverlay) => {
      ffCesium.value.removeHtml(htmlOverlay);
    });
    allPoint.value = [];
    // 介绍
    if (!allcontent.value.length) {
      addHtmlFun();
    }
    if (modelList.value.length) {
      //model标签清除
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
  }
  if (value < 3400 && value > 1400) {
    console.log("第三级", value);
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
</script>
<style lang="scss" scoped>
.box {
  position: absolute;
  top: 30px;
  left: 450px;
  z-index: 999;
}
.content {
  background-image: url("/public/img/mapServer/background.png");
  background-size: 100% 100%;
  z-index: 99;
  width: 200px;
  height: 130px;
  padding-left: 20px;
  padding-top: 15px;
  color: white;
}
</style>
