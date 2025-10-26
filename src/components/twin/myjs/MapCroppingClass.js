import areaHeightJson from "../data/newAreaHeight.json";
import areaScaleHeight from "../data/newAreaHeight500.json";
import areaScaleHeight10 from "../data/newAreaHeight10.json";

import * as Cesium from "cesium";
import { DynamicWallMaterialProperty } from "../libs/dynamicWallMaterial.js";
import dynamicWallMaterialImg from "../images/dynamicWallMaterial.png";
import * as turf from "@turf/turf";

class MapCroppingClass {
  ffCesium;

  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  //裁剪区域
  mapCropping() {
    console.log("areaHeightJson11", areaHeightJson);
    let pointList = areaHeightJson.features[0].geometry.coordinates[0][0];
    let latlngArr = [];
    pointList.forEach((item, index) => {
      latlngArr.push(item[0]);
      latlngArr.push(item[1]);
    });
    this.ffCesium.showMapByAreaLngLat(latlngArr);
    //叠加区域面（挖空）
    this.addPolygonHole();
    //叠加外围边
    this.addWaiwei();
    this.addLightWall();
  }
  addLightWall() {
    let pointList = areaHeightJson.features[0].geometry.coordinates[0][0];
    let minimumHeightsArr = [];
    let maximumHeightsArr = [];
    for (let i = 0; i < pointList.length; i++) {
      minimumHeightsArr.push(-3000);
      maximumHeightsArr.push(pointList[i][2]);
    }
    console.log("addWaiwei--pointList", pointList);

    let wallEntity = this.ffCesium.viewer.entities.add({
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
        /**
         * color（颜色）：颜色
         * speed（速度）：越低越快
         * count（条数）：分隔条数
         * freely（纵横）：
         * vertical纵，cross横
         * direction（方向）：
         *    纵：'-'（由下到上），'+'（由上到下）
         *    横：'-'（顺时针），'+'（逆时针）
         *  Cesium.Color.fromCssColorString("#C3F6FF"),
         */
        material: new DynamicWallMaterialProperty(
          Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(0.5),
          "100.0",
          "1.0",
          "vertical",
          "-",
          dynamicWallMaterialImg
        ),
        minimumHeights: minimumHeightsArr,
        maximumHeights: maximumHeightsArr,
      },
    });
    // window.setTimeout(() => {
    //   //wallEntity.wall.material = this.getColorRamp();
    // }, 5000);
  }
  //叠加外围边
  addWaiwei() {
    let pointList = areaScaleHeight10.features[0].geometry.coordinates[0][0];
    let minimumHeightsArr = [];
    let maximumHeightsArr = [];
    for (let i = 0; i < pointList.length; i++) {
      minimumHeightsArr.push(-3000);
      maximumHeightsArr.push(pointList[i][2] + 150);
    }
    console.log("addWaiwei--pointList", pointList);

    this.ffCesium.viewer.entities.add({
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointList.flat()),
        //material: Cesium.Color.fromCssColorString("#4ABAE9"),
        material: this.getColorRamp(),
        minimumHeights: minimumHeightsArr,
        maximumHeights: maximumHeightsArr,
      },
    });
  }

  //外围边材质
  getColorRamp() {
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
  }
  //叠加区域面（挖空）
  addPolygonHole() {
    console.log("areaHeightJson.features[0]", areaHeightJson.features[0]);
    let coordinates = areaHeightJson.features[0].geometry.coordinates[0][0];
    //抬高高度
    if (!areaHeightJson.liftingFlag) {
      for (let i = 0; i < coordinates.length; i++) {
        coordinates[i][2] = coordinates[i][2] + 1500; //tmj 20240822从原来150增加到1500
      }
    }
    areaHeightJson.liftingFlag = true;

    let scaleCoordinates =
      areaScaleHeight.features[0].geometry.coordinates[0][0];
    if (!scaleCoordinates.liftingFlag) {
      for (let i = 0; i < scaleCoordinates.length; i++) {
        scaleCoordinates[i][2] = scaleCoordinates[i][2] + 1500; //tmj 20240822从原来150增加到1500
      }
    }
    scaleCoordinates.liftingFlag = true;
    let holes = [
      {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          scaleCoordinates.flat()
        ),
      },
    ];
    //上面线（边）
    this.ffCesium.viewer.entities.add({
      polygon: {
        perPositionHeight: true,
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            coordinates.flat()
          ),
          holes: holes,
        },
        //73FEFF
        //C3F6FF
        material: Cesium.Color.fromCssColorString("#73FEFF").withAlpha(1),
      },
    });

    //下边线（边）
    this.ffCesium.viewer.entities.add({
      polygon: {
        height: -3000,
        extrudedHeight: -3500.0,
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            coordinates.flat()
          ),
          holes: holes,
        },
        material: Cesium.Color.fromCssColorString("#7FF1FF").withAlpha(1),
      },
    });
  }
}

export default MapCroppingClass;
