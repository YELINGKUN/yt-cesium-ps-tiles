import * as Cesium from "cesium";

//地图接入
import { mapServer } from "./libs/MapAccess/mapServer.js";
import { dataServer } from "./libs/MapAccess/dataServer.js";
//地图基础操作
import { mapTool } from "./libs/MapOperate/mapTool.js";
import { addPrimitive } from "./libs/MapOperate/addPrimitive.js";
import { mapAction } from "./libs/MapOperate/mapAction.js";
import { addOtherElement } from "./libs/MapOperate/addOtherElement.js";
import { addEntity } from "./libs/MapOperate/addEntity.js";
import { layerManager } from "./libs/MapOperate/layerManager.js";

//地图采集
import { elementGather } from "./libs/MapGather/elementGather.js";
import { elementEdit } from "./libs/MapGather/elementEdit.js";

//地图效果
import { particleSystem } from "./libs/MapEffect/particleSystem.js";
import { polygonEffect } from "./libs/MapEffect/polygonEffect.js";
import { polylineEffect } from "./libs/MapEffect/polylineEffect.js";
//空间分析
import { judgeRelation } from "./libs/SpatialAnalysis/judgeRelation.js";

//高级示例
import { addType } from "./libs/AdvancedExamples/addType.js";
//其他
import { pipe } from "./libs/pipe.js";

//高级示例
import RotateTool from "../senior/libs/rotateTool/index.js";
//地图通用工具包
import { mapUtil } from "./libs/mapUtil.js";
//ou-demo
import { addDemo } from "./libs/Demo/addDemo.js";

import FlyRoam from "../senior/libs/flyRoam/index.js";

//入口文件
/**
 * CesiumPlus类用于封装Cesium的viewer，提供一系列地图操作方法。
 * 通过构造函数初始化viewer，并根据配置选项设置地图的初始状态。
 * 采用单例模式，确保全局只有一个实例。
 */
class CesiumPlus {
  Version = "V1.0.0";
  cesiumID;
  viewer;
  Cesium;
  rotateTool;
  flyRoam;

  // 单例模式相关属性
  static _instance = null;
  static _isInitialized = false;

  /**
   * 获取CesiumPlus单例实例
   * @param {string} id - Cesium视图的DOM元素ID。
   * @param {Object} option - 初始化viewer的选项。
   * @returns {CesiumPlus} CesiumPlus实例
   */
  static getInstance(id, option) {
    if (!CesiumPlus._instance) {
      if (!id) {
        throw new Error("CesiumPlus: 首次创建实例时必须提供DOM元素ID");
      }
      CesiumPlus._instance = new CesiumPlus(id, option);
      CesiumPlus._isInitialized = true;
    } else if (CesiumPlus._isInitialized && id) {
      console.warn("CesiumPlus: 实例已存在，忽略新的初始化参数");
    }
    return CesiumPlus._instance;
  }

  /**
   * 检查是否已有实例
   * @returns {boolean} 是否已有实例
   */
  static hasInstance() {
    return CesiumPlus._instance !== null;
  }

  /**
   * 销毁单例实例
   */
  static destroyInstance() {
    if (CesiumPlus._instance) {
      // 清理viewer资源
      if (CesiumPlus._instance.viewer) {
        CesiumPlus._instance.viewer.destroy();
      }
      CesiumPlus._instance = null;
      CesiumPlus._isInitialized = false;
    }
  }

  /**
   * CesiumPlus类的构造函数（私有化，通过getInstance调用）
   * @param {string} id - Cesium视图的DOM元素ID。
   * @param {Object} option - 初始化viewer的选项。
   */
  constructor(id, option) {
    this.Cesium = Cesium;
    //合并其他文件JS文件方法1231
    let time1 = new Date().getTime();
    Object.assign(CesiumPlus.prototype, {
      //地图接入
      ...mapServer,
      ...dataServer,
      //地图操作
      ...mapTool,
      ...addPrimitive,
      ...mapAction,
      ...addOtherElement,
      ...layerManager,
      //地图采集
      ...elementGather,
      ...elementEdit,
      //地图效果
      ...particleSystem,
      ...polygonEffect,
      ...polylineEffect,
      //空间分析
      ...judgeRelation,
      //高级示例
      ...addType,
      //地图通用工具包
      ...mapUtil,
      //地图实体叠加
      ...addEntity,
      //其他
      ...pipe,
      ...addDemo,
    });

    let time2 = new Date().getTime();

    console.log("CesiumPlus所使用Cesium版本", Cesium.VERSION);
    console.log("CesiumPlus注册方法耗时（ms）", time2 - time1);

    this.cesiumID = id;
    if (!option) {
      this.defaultMap();
    } else {
      if (option.viewer) {
        //不是用FFCesium进行初始化的使用方式
        this.viewer = option.viewer;
      } else {
        this.viewer = new Cesium.Viewer(id, option);
      }
    }
    this.viewer.defaultSkybox = this.viewer.scene.skyBox;
    this.viewer._cesiumWidget._creditContainer.style.display = "none"; //去除版权信息
    let time3 = new Date().getTime();
    this.rotateTool = new RotateTool(this);
    this.flyRoam = new FlyRoam(this);

    this.addPrimitiveInit();
    console.log("CesiumPlus构建总耗时（ms）", time3 - time1);
  }

  /**
   * 设置默认的地图视图。
   * @returns {Object} 添加的高德地图图层。
   */
  defaultMap() {
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
    };
    this.viewer = new Cesium.Viewer(this.cesiumID, viewerOption);
    //得加高德标准地图
    let mapLayer = this.addGaodeLayer(
      "https://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
    );
    this.setView({
      lng: 118.135,
      lat: 24.339,
      height: 20000,
      pitchRadiu: -50,
    });
    // this.setView({
    //   lng: 118.135,
    //   lat: 24.339,
    //   height: 10000000,
    //   pitchRadiu: -90,
    // });
    return mapLayer;
  }
  /**
   * 监听屏幕点击事件，获取点击位置的经纬度和高度。
   */
  getXyEvent() {
    let the = this;
    let getXYHandle = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    getXYHandle.setInputAction(function (event) {
      //获取加载地形后对应的经纬度和高程：地标坐标
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (Cesium.defined(cartesian)) {
        // 转换为经纬度
        const cartographic =
          the.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        const height = the.viewer.scene.globe.getHeight(cartographic);
        // 输出点击的经纬度和高度
        console.log("采集坐标：" + longitudeString + "," + latitudeString);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  //添加实体，官网已经够简捷不需要封装，可直接使用
  //参考文档：https://www.vvpstk.com/public/Cesium/Documentation/Entity.html?classFilter=entity

  /**
   * 添加实体到观众
   *
   * 本函数用于向当前观众的实体集合中添加一个新的实体。这可以通过提供一个实体选项对象来实现，
   * 该对象定义了新实体的各种属性，如位置、形状和外观。
   *
   * @param {Object} option 实体选项对象，包含了新实体的各种属性定义。
   * @returns {Entity} 返回新添加的实体对象。
   */
  addFFEntity(option) {
    // 通过viewer的entities对象添加新的实体，并返回该实体对象
    return this.viewer.entities.add(option);
  }

  //删除实体Entity
  /**
   *
   * @param {Array} FFEntityArray 实体对象
   */
  removeFFEntityArray(FFEntityArray) {
    console.log("removeFFEntityArray", FFEntityArray);
    FFEntityArray.forEach((element) => {
      this.viewer.entities.remove(element);
    });
  }
  //删除原始图形Primitive（数组）
  /**
   *
   * @param {Array} FFPrimitiveArray 原始图形对象
   */
  removeFFPrimitiveArray(FFPrimitiveArray) {
    FFPrimitiveArray.forEach((element) => {
      this.viewer.scene.primitives.remove(element);
    });
  }
  switchTo2D() {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE2D; //视角不会变
  }
  switchTo3D() {
    this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  }
}

export default CesiumPlus;
