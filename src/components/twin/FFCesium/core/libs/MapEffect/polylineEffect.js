import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import flickerBase64 from "../../images/flicker.png";
import PolylineFlow from "../../../dependentLib/polylineFlow.js";

import { getLngLatArrFromLngLatHeightArr } from "../../../dependentLib/util.js";

export const polylineEffect = {
  /**
   * 根据折线点数组和选项添加移动点。
   * @param {Array} movePointArr - 折线点数组。
   * @param {Object} option - 配置选项，包括添加类型、高度、像素大小和颜色等。
   * @returns {Array} 返回包含移动点实体的数组。
   */
  addPolylineMovePoint(movePointArr, option) {
    let pointEntityArray = [];
    var line = turf.lineString(movePointArr);
    var length = turf.length(line, { units: "meters" });
    var chunk = null;
    if (length > 40000) {
      chunk = turf.lineChunk(line, 80, { units: "meters" });
    } else if (length > 5000) {
      chunk = turf.lineChunk(line, 60, { units: "meters" });
    } else if (length > 1000) {
      chunk = turf.lineChunk(line, 40, { units: "meters" });
    } else {
      chunk = turf.lineChunk(line, 20, { units: "meters" });
    }
    for (let i = 0; i < chunk.features.length; i++) {
      if (i % 30 == 0 && chunk.features.length - i > 16) {
        let movePoint = null;
        if (option.addType == "entity") {
          movePoint = this.addPolylineMovePointByEntity(chunk, i, option);
          pointEntityArray.push(movePoint);
        } else {
          movePoint = this.addPolylineMovePointByPrimitive(chunk, i, option);
          pointEntityArray.push(movePoint);
        }
      }
    }
    pointEntityArray.addType = option.addType;
    return pointEntityArray;
  },
  /**
   * 通过Primitive添加线移动点
   * @param {Object} chunk - 折线段对象。
   * @param {number} indexFlag - 索引标志。
   * @param {Object} option - 配置选项。
   * @returns {Object} 返回点Primitive对象。
   */
  addPolylineMovePointByPrimitive(chunk, indexFlag, option) {
    let lnglat = [
      chunk.features[0].geometry.coordinates[1][0],
      chunk.features[0].geometry.coordinates[1][1],
      option.height,
    ];
    let pointPrimitive = this.addPointPrimitive(lnglat, option);
    let intervalTimer = setInterval(() => {
      if (indexFlag < chunk.features.length - 1) {
        indexFlag = indexFlag + 1;
      } else {
        indexFlag = 0;
      }
      const chunkLng = chunk.features[indexFlag].geometry.coordinates[1][0];
      const chunkLat = chunk.features[indexFlag].geometry.coordinates[1][1];
      pointPrimitive.position = Cesium.Cartesian3.fromDegrees(
        chunkLng,
        chunkLat,
        option.height
      );
    }, 20);
    pointPrimitive.intervalTimer = intervalTimer;
    return pointPrimitive;
  },
  /**
   * 通过Entity方式添加线移动点。
   * @param {Object} chunk - 折线段对象。
   * @param {number} indexFlag - 索引标志。
   * @param {Object} option - 配置选项。
   * @returns {Object} 返回点Entity对象。
   */
  addPolylineMovePointByEntity(chunk, indexFlag, option) {
    let pointEntity = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(
        chunk.features[0].geometry.coordinates[1][0],
        chunk.features[0].geometry.coordinates[1][1],
        option.height
      ),
      point: {
        pixelSize: option.pixelSize,
        color: Cesium.Color.fromCssColorString(option.color),
      },
    });
    pointEntity.type = "FFCesiumAddMovePoint";
    this.viewer.entities.add(pointEntity);
    pointEntity._position = new Cesium.CallbackProperty(function () {
      if (indexFlag < chunk.features.length - 1) {
        indexFlag = indexFlag + 1;
      } else {
        indexFlag = 0;
      }
      const chunkLng = chunk.features[indexFlag].geometry.coordinates[1][0];
      const chunkLat = chunk.features[indexFlag].geometry.coordinates[1][1];
      var cartesian = Cesium.Cartesian3.fromDegrees(
        chunkLng,
        chunkLat,
        option.height
      );
      return cartesian;
    }, false);
    return pointEntity;
  },
  /**
   * 移除折线移动点。
   * @param {Array} polylineMovePointArr - 折线移动点数组。
   */
  removePolylineMovePoint(polylineMovePointArr) {
    if (polylineMovePointArr.addType == "entity") {
      for (let i = 0; i < polylineMovePointArr.length; i++) {
        this.viewer.entities.remove(polylineMovePointArr[i]);
      }
    } else {
      for (let i = 0; i < polylineMovePointArr.length; i++) {
        clearInterval(polylineMovePointArr[i].intervalTimer);
        this.removeFFPrimitive(polylineMovePointArr[i]);
      }
    }
    polylineMovePointArr = [];
  },
  /**
   * 添加闪烁线。
   * @param {Array} lnglatArr - LngLat坐标数组。
   * @param {Object} option - 配置选项，包括添加类型、宽度和颜色等。
   * @returns {Object} 返回闪烁线对象。
   */
  addPolylineFlicker(lnglatArr, option) {
    if (option.addType == "entity") {
      return this.addPolylineFlickerByEntity(lnglatArr, option);
    } else {
      return this.addPolylineFlickerByPrimitive(lnglatArr, option);
    }
  },

  /**
   * 删除闪烁线。
   * @param {Object} polylineFlickerObj - 闪烁线对象。
   */
  removePolylineFlicker(polylineFlickerObj) {
    if (polylineFlickerObj.addType == "entity") {
      this.viewer.entities.remove(polylineFlickerObj);
    } else {
      clearInterval(polylineFlickerObj.intervalTimer);
      this.viewer.scene.primitives.remove(polylineFlickerObj);
    }
  },
  /**
   * 通过Primitive方式添加闪烁线。
   * @param {Array} lnglatArr - 经纬度数组，每个元素是一个包含经度、纬度和高度的数组。
   * @param {Object} option - 配置选项，包括宽度和颜色等。
   * @returns {Object} 返回闪烁线Primitive对象。
   */
  addPolylineFlickerByPrimitive(lnglatArr, option) {
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: option.width,
      }),
    });
    const primitive = new Cesium.Primitive({
      geometryInstances: instance, //可以是实例数组
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: new Cesium.Color.fromCssColorString(option.color),
            },
          },
        }),
      }),
    });
    primitive.flickerFlag = 1;
    primitive.flickerChangeFlag = "minus";
    let intervalTimer = setInterval(() => {
      if (primitive.flickerChangeFlag == "plus") {
        primitive.flickerFlag = primitive.flickerFlag + 0.02;
        if (primitive.flickerFlag > 1) {
          primitive.flickerChangeFlag = "minus";
        }
      } else if (primitive.flickerChangeFlag == "minus") {
        primitive.flickerFlag = primitive.flickerFlag - 0.02;
        if (primitive.flickerFlag < 0.3) {
          primitive.flickerChangeFlag = "plus";
        }
      }
      primitive.appearance.material.uniforms.color =
        Cesium.Color.fromCssColorString(option.color).withAlpha(
          primitive.flickerFlag
        );
    }, 20);
    primitive.intervalTimer = intervalTimer;
    primitive.addType = option.addType;
    this.viewer.scene.primitives.add(primitive);
    return primitive;
  },

  //添加闪烁线
  /**
   * 通过Entity方式添加闪烁效果的折线
   * @param {Array} lnglatArr - 经纬度数组
   * @param {Object} option - 折线的配置选项，包括颜色、宽度和类型等
   * @returns {Object} 返回添加的折线实体对象
   */
  addPolylineFlickerByEntity(lnglatArr, option) {
    let FFentity = this.viewer.entities.add({
      show: true,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: 5,
        material: Cesium.Color.fromCssColorString(option.color),
      },
    });
    FFentity.flickerFlag = 1;
    FFentity.flickerChangeFlag = "minus";
    FFentity.polyline = {
      positions: FFentity.polyline.positions,
      width: option.width,
      material: new Cesium.ImageMaterialProperty({
        image: flickerBase64,
        color: new Cesium.CallbackProperty(function () {
          if (FFentity.flickerChangeFlag == "plus") {
            FFentity.flickerFlag = FFentity.flickerFlag + 0.02;
            if (FFentity.flickerFlag > 1) {
              FFentity.flickerChangeFlag = "minus";
            }
          } else if (FFentity.flickerChangeFlag == "minus") {
            FFentity.flickerFlag = FFentity.flickerFlag - 0.02;
            if (FFentity.flickerFlag < 0.3) {
              FFentity.flickerChangeFlag = "plus";
            }
          }
          return Cesium.Color.fromCssColorString(option.color).withAlpha(
            FFentity.flickerFlag
          );
        }, false),
        repeat: new Cesium.Cartesian2(1.0, 1.0),
        transparent: true,
      }),
    };
    FFentity.addType = option.addType;
    return FFentity;
  },
  /**
   * 在地图上添加流动效果的折线
   * @param {Array} lnglatArr - 经纬度数组
   * @param {Object} option - 折线的配置选项，包括颜色、宽度、图片URL和流动速度等
   * @returns {Object} 返回添加的折线实体对象
   */
  addPolylineFlow(lnglatArr, option) {
    console.log("lnglatArr, option", lnglatArr, option);
    let polygonFlowObj = new PolylineFlow(
      Cesium.Color.fromCssColorString(option.color),
      option.url,
      option.time
    );

    let polylineObj = this.viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: option.width,
        material: polygonFlowObj,
      },
    });
    return polylineObj;
  },
  /**
   * 删除地图上的流动折线
   * @param {Object} polylineObj - 要删除的折线实体对象
   */
  removePolylineFlow(polylineObj) {
    this.viewer.entities.remove(polylineObj);
  },
  /**
   * 添加流动线段
   * @param {Array} lnglatArr - 经纬度数组
   */
  addFlowLineSegment(lnglatArr) {
    console.log("addFlowLineSegment--lnglatArr", lnglatArr);
    this.viewer.entities.add({
      polyline: {
        width: 10,
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        // material: new ImageLineMaterial({
        //   image: "./images/FFCesium/MapEffect/polylineEffect/new.png",
        //   //image: "./img/advancedTools/showMapByAreaLngLat.png",
        // }),
        material: new PolylineTrailLinkMaterialPropertyRoad1(
          new Cesium.Color.fromCssColorString("#0cfd11"),
          20000
        ),
      },
    });
  },
  /**
   * 添加线段上的标签
   * @param {Array} lnglatHeightArr - 经纬度高度数组
   * @param {Object} option - 标签的配置选项，包括标签内容、字体大小、字体颜色、背景颜色等
   */
  addLineSegmentLabel(lnglatHeightArr, option) {
    let htmlOverlayArr = [];
    let labelArr = [...option.label];
    // console.log("addLineSegmentLabel--labelArr", labelArr);
    var line = turf.lineString(
      getLngLatArrFromLngLatHeightArr(lnglatHeightArr)
    );
    var lineLength = turf.length(line, { units: "meters" });
    //console.log("线段长度lineLength", lineLength);
    let cutLength = lineLength / (labelArr.length + 1);
    //console.log("分割线段长度为：", cutLength);
    let chunk = turf.lineChunk(line, cutLength, { units: "meters" });
    //console.log("分割chunk", chunk);
    chunk.features.forEach((item, index) => {
      if (index < labelArr.length) {
        let lng =
          item.geometry.coordinates[item.geometry.coordinates.length - 1][0];
        let lat =
          item.geometry.coordinates[item.geometry.coordinates.length - 1][1];
        let lngLatHeight = [lng, lat, 10];
        let html = "";
        html +=
          "<div style='" + option.styleStr + "'>" + labelArr[index] + "</div>";
        let htmlOverlay = this.addHtml(lngLatHeight, html, option.offset);
        htmlOverlayArr.push(htmlOverlay);
      }
    });
    return htmlOverlayArr;
  },
};
