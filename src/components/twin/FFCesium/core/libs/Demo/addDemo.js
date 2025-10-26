import * as Cesium from "cesium";
import * as turf from "@turf/turf";
export const addDemo = {
  /**
   * 点击获取地图上的实体
   * @param {*} fun 回调函数 参数为选中的实体
   */
  getClickModel(fun, nofun) {
    var thi = this; // 在合适的作用域内保存 this
    var handler = new Cesium.ScreenSpaceEventHandler(thi.viewer.scene.canvas);
    handler.setInputAction(function (movement) {
      var pick = thi.viewer.scene.pick(movement.position);
      if (Cesium.defined(pick)) {
        console.log("选中pick", pick.id);
        fun(pick);
      } else {
        nofun();
        // console.log("没选中pick", pick);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // 鼠标抒发点击事件
  },
  // 添加测点
  addMonitor1(lngLatHeight, option) {
    let billboardEntity = null;
    let optionPoint = {
      pixelSize: option.pointPixelSize,
      color: option.pointColor,
      alpha: option.pointAlpha,
    };
    this.addPointPrimitive(lngLatHeight, optionPoint);
    let lineNext = [
      lngLatHeight[0], // 经度
      lngLatHeight[1], // 纬度
      lngLatHeight[2] + option.height, // 高度加上变量 a
    ];
    let lnglatArr = [lngLatHeight, lineNext];
    let optionline = {
      width: option.lineWidth,
      color: option.lineColor,
      alpha: option.lineAlpha,
    };
    // this.addPolylinePrimitive(lnglatArr, optionline);
    let optionFlow = {
      width: option.lineWidth + 1,
      // color: option.lineColor,
      color: "#FFFFFF",
      url: option.lineImg,
      time: option.height / 0.5,
    };
    this.addPolylineFlow(lnglatArr, optionFlow);
    let optionImg = {
      image: option.image,
      pixelOffset: option.imgPixelOffset,
    };
    billboardEntity = this.addBillboardEntity(lineNext, optionImg);
    // billboardEntity.type = "mmm";
    if (option.showTitle) {
      this.addHtml(lineNext, option.htmlStr, option.offset);
    }
    this.addHtml(lngLatHeight, option.htmlPoint, option.offset);

    return billboardEntity;
  },
  addMonitor(lngLatHeight, option) {
    if (option.showTitle) {
      this.addHtml(lngLatHeight, option.htmlStr, option.offsethtmlStr); //标签
    }
    this.addHtml(lngLatHeight, option.htmlLog, option.offsethtmllogo); //logo
    this.addHtml(lngLatHeight, option.htmlLine, option.offset); //线
    console.log("lngLatHeight", lngLatHeight);
    this.addHtml(lngLatHeight, option.htmlPoint, option.offset); //底座点
  },
  addLabel(lngLatHeight, htmlmodel, offset) {
    // let modelList = [],
    let lineone = [
      lngLatHeight[0], // 经度
      lngLatHeight[1], // 纬度
      lngLatHeight[2] + 120, // 高度加上变量 a
    ];
    let lineNext = [
      lngLatHeight[0] + 0.001, // 经度
      lngLatHeight[1], // 纬度
      lngLatHeight[2] + 300, // 高度加上变量 a
    ];
    let lnglatArr = [lineone, lineNext];
    let optionline = {
      width: 1,
      color: "#27408B",
      alpha: 0.5,
    };
    let line = this.addPolylinePrimitive(lnglatArr, optionline);
    let htm = this.addHtml(lineNext, htmlmodel, offset);
    htm.style.zIndex = 99;
    // modelList.push(htm);
    // modelList.push(line);
    return { htm, line };
  },
  // removeLabel() {
  //   if (modelList.length) {
  //     modelList.map((htmlOverlay) => {
  //       if (htmlOverlay.FFtype) {
  //         this.removeFFPrimitive(htmlOverlay);
  //       } else {
  //         this.removeHtml(htmlOverlay);
  //       }
  //     });
  //   }
  //   modelList.value = [];
  // },
  getHeight(fun) {
    let height = 0;
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((wheelment) => {
      height = this.viewer.camera.positionCartographic.height;
      // console.log("height", height);
      fun(height);
    }, Cesium.ScreenSpaceEventType.WHEEL);
    return height;
  },
  addGLTFentity(lngLatHeight, optionModel) {
    const position = this.Cesium.Cartesian3.fromDegrees(...lngLatHeight);
    const heading = Cesium.Math.toRadians(optionModel.heading); //135度转弧度
    const pitch = Cesium.Math.toRadians(0);
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
    let models = {
      name: `gltf`,
      // id: `aagltf${index}`,
      position: position,
      orientation: orientation,
      model: {
        uri: optionModel.url, //注意entitits.add方式加载gltf文件时，这里是uri，不是url，并且这种方式只能加载.glb格式的文件
        scale: optionModel.scale, //缩放比例
        minimumPixelSize: optionModel.minimumPixelSize, //最小像素大小，可以避免太小看不见
        maximumScale: optionModel.maximumScale, //模型的最大比例尺大小。minimumPixelSize的上限
        incrementallyLoadTextures: true, //加载模型后纹理是否可以继续流入
        runAnimations: false, //是否启动模型中制定的gltf动画
        clampAnimations: true, //制定gltf动画是否在没有关键帧的持续时间内保持最后一个姿势
        shadows: Cesium.ShadowMode.ENABLED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        // silhouetteSize: 18.0,
        silhouetteColor: new Cesium.Color(1.0, 0.0, 1.0, 1),
      },
    };
    const entity = this.viewer.entities.add(models);
    return models;
  },
  //添加面上的标签
  addFaceLabel(lnglatArr, option) {
    console.log("ZHENDFULE");
    lnglatArr.push(lnglatArr[0]);
    var polygon = turf.polygon([lnglatArr]);

    var centroid = turf.centroid(polygon, {
      desc: "centroid",
    });
    const centerPoint = turf.center(turf.polygon([lnglatArr]));
    const newZB = [
      centerPoint.geometry.coordinates[0],
      centerPoint.geometry.coordinates[1] - 0.001,
      option.height,
    ];
    // let offset = { top: 0, left: 0 };
    let html = `<div style='${option.styleStr}'>${option.name}</div>`;
    let faceName = this.addHtml(newZB, html, option.offset);
    faceName.style.zIndex = 99;
    return faceName;
  },
};
