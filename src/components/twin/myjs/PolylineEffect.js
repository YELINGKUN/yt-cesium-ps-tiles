import * as Cesium from "cesium";
import canalData from "../data/canal4.json";
import PolylineFluid from "./PolylineFluid.js";
import polylineEffect30 from "../images/oneArrow.png";
//import polylineEffect9 from "../images/riverlight40.png";
import polylineEffect9 from "../images/river108.png";

import riverPoint from "../images/riverPoint1.png";
import riverTwoLine from "../images/oneLine1.png";

import * as turf from "@turf/turf";

class PolylineEffect {
  ffCesium;
  arrowPolylineFluid;

  twoLinePolylineFluid;

  pointPolylineFluid;
  pointPolylineBackArr = [];

  //干渠
  mainCanalPolylineFluid;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  delete() {
    this.deleteTwoLine();
    this.deletePoint();
    this.deleteArrow();
  }

  removeAll() {
    //清除干渠
    this.deleteMainCanalPolylineFluid();
    //清除支渠
    this.deleteTwoLine();
    this.deletePoint();
    this.deleteArrow();
  }

  deleteTwoLine() {
    //清除支渠效果
    if (this.twoLinePolylineFluid) {
      for (
        let i = 0;
        i < this.twoLinePolylineFluid.polylineFluidEntityArr.length;
        i++
      ) {
        this.ffCesium.viewer.entities.remove(
          this.twoLinePolylineFluid.polylineFluidEntityArr[i]
        );
      }
      //移除事件
      this.twoLinePolylineFluid.polylineFluidHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.WHEEL
      );
      this.twoLinePolylineFluid = null;
    }
  }
  addTwoLine() {
    this.delete();
    this.twoLinePolylineFluid = new PolylineFluid(this.ffCesium);
    for (let i = 0; i < canalData.features.length; i++) {
      let feature = canalData.features[i];
      var length = turf.length(feature, { units: "meters" });
      //console.log("feature", feature);
      if (canalData.features[i].geometry) {
        let zbcArr = canalData.features[i].geometry.coordinates;

        let newZbcArr = [];
        zbcArr.forEach((item) => {
          newZbcArr.push([item[0], item[1]]);
        });
        let imgUrl = null;
        let color = null;
        let widthCoefficient = 0;
        let times = 0;
        let fluidConfig = null;
        let time = null;
        if (feature.properties.layer.indexOf("支渠") >= 0) {
          color = "#9AFEFE";
          imgUrl = riverTwoLine;
          widthCoefficient = 1;
          times = length / 3000;
          time = Math.ceil(length / 2000) * 1000;
          fluidConfig = [
            {
              range: [100000, 10000000],
              times: Math.ceil(times / 3),
              time: time / 3,
            },
            {
              range: [50000, 100000],
              times: Math.ceil(times / 1.5),
              time: time / 1.5,
            },
            {
              range: [20000, 50000],
              times: Math.ceil(times * 1.5),
              time: time * 1.5,
            },
            {
              range: [10000, 20000],
              times: Math.ceil(times * 2),
              time: time * 2,
            },
            {
              range: [5000, 10000],
              times: Math.ceil(times * 2.5),
              time: time * 2.5,
            },
            {
              range: [3000, 5000],
              times: Math.ceil(times * 3),
              time: time * 3,
            },
            {
              range: [0, 3000],
              times: Math.ceil(times * 5),
              time: time * 5,
            },
          ];

          let option1 = {
            color: color,
            widthCoefficient: widthCoefficient,
            imgUrl: imgUrl,
            showBackPolyline: false,
            fluidConfig: fluidConfig,
            type: "branch",
          };
          console.log("option1tt", option1);
          this.twoLinePolylineFluid.addPolylineFluid(newZbcArr, option1);
        }
      }
    }
    console.log("this.twoLinePolylineFluid", this.twoLinePolylineFluid);
  }

  deletePoint() {
    //清除支渠效果
    if (this.pointPolylineFluid) {
      for (
        let i = 0;
        i < this.pointPolylineFluid.polylineFluidEntityArr.length;
        i++
      ) {
        this.ffCesium.viewer.entities.remove(
          this.pointPolylineFluid.polylineFluidEntityArr[i]
        );
      }
      //移除事件
      this.pointPolylineFluid.polylineFluidHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.WHEEL
      );

      this.pointPolylineFluid = null;
    }
    if (this.pointPolylineBackArr) {
      for (let i = 0; i < this.pointPolylineBackArr.length; i++) {
        this.ffCesium.viewer.entities.remove(this.pointPolylineBackArr[i]);
      }
      this.pointPolylineBackArr = [];
    }
    //清除事件
  }
  /***/
  addPoint() {
    this.delete();
    this.pointPolylineFluid = new PolylineFluid(this.ffCesium);
    for (let i = 0; i < canalData.features.length; i++) {
      let feature = canalData.features[i];
      var length = turf.length(feature, { units: "meters" });
      //console.log("feature", feature);
      if (canalData.features[i].geometry) {
        let zbcArr = canalData.features[i].geometry.coordinates;

        if (feature.properties.layer.indexOf("支渠") >= 0) {
          let entityTemp = this.ffCesium.viewer.entities.add({
            polyline: {
              clampToGround: true,
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                zbcArr.flat()
              ),
              width: 5,
              material:
                Cesium.Color.fromCssColorString("#58D4DE").withAlpha(0.8),
            },
          });
          this.pointPolylineBackArr.push(entityTemp);
        }

        let newZbcArr = [];
        zbcArr.forEach((item) => {
          newZbcArr.push([item[0], item[1]]);
        });
        let imgUrl = null;
        let color = null;
        let widthCoefficient = 0;
        let times = 0;
        let fluidConfig = null;
        let time = null;
        if (feature.properties.layer.indexOf("支渠") >= 0) {
          color = "#ffff00";
          imgUrl = riverPoint;
          widthCoefficient = 8;
          times = length / 1000;
          time = Math.ceil(length / 1000) * 1000;
          fluidConfig = [
            {
              range: [100000, 10000000],
              times: Math.ceil(times / 2),
              time: time / 2,
            },
            {
              range: [50000, 100000],
              times: Math.ceil(times / 1.5),
              time: time / 1.5,
            },
            {
              range: [20000, 50000],
              times: Math.ceil(times * 1.5),
              time: time * 1.5,
            },
            {
              range: [10000, 20000],
              times: Math.ceil(times * 2),
              time: time * 2,
            },
            {
              range: [5000, 10000],
              times: Math.ceil(times * 2.5),
              time: time * 2.5,
            },
            {
              range: [3000, 5000],
              times: Math.ceil(times * 3),
              time: time * 3,
            },
            {
              range: [0, 3000],
              times: Math.ceil(times * 5),
              time: time * 5,
            },
          ];

          let option1 = {
            color: color,
            widthCoefficient: widthCoefficient,
            imgUrl: imgUrl,
            showBackPolyline: false,
            fluidConfig: fluidConfig,
            type: "branch",
          };
          this.pointPolylineFluid.addPolylineFluid(newZbcArr, option1);
        }
      }
    }
    console.log("this.pointPolylineFluid", this.pointPolylineFluid);
  }

  /** 
  addPoint() {
    this.deleteArrow();
    for (let i = 0; i < canalData.features.length; i++) {
      if (canalData.features[i].geometry) {
        if (canalData.features[i].properties.layer.indexOf("支渠") >= 0) {
          let zbcArr = canalData.features[i].geometry.coordinates;
          console.log("zbcArr 1WWWW", zbcArr);
          this.ffCesium.viewer.entities.add({
            polyline: {
              clampToGround: true,
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                zbcArr.flat()
              ),
              width: 4,
              material:
                Cesium.Color.fromCssColorString("#58D4DE").withAlpha(0.8),
            },
          });

          let notHeightzbcArr =
            this.ffCesium.getLngLatArrFromLngLatHeightArr(zbcArr);
          let pointEntityArray = this.ffCesium.addPolylineMovePoint(
            notHeightzbcArr,
            {
              height: 150,
              color: "#FBFF65",
              alpha: 1,
              pixelSize: 6,
              addType: "primitive", //可选值：entity,primitive
            }
          );
        }
      }
    }
  }
    */
  deleteArrow() {
    if (this.arrowPolylineFluid) {
      for (
        let i = 0;
        i < this.arrowPolylineFluid.polylineFluidEntityArr.length;
        i++
      ) {
        this.ffCesium.viewer.entities.remove(
          this.arrowPolylineFluid.polylineFluidEntityArr[i]
        );
      }
      //移除事件
      this.arrowPolylineFluid.polylineFluidHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.WHEEL
      );
      this.arrowPolylineFluid = null;
    }
  }
  addArrow() {
    this.delete();
    this.arrowPolylineFluid = new PolylineFluid(this.ffCesium);
    for (let i = 0; i < canalData.features.length; i++) {
      let feature = canalData.features[i];
      var length = turf.length(feature, { units: "meters" });
      //console.log("feature", feature);
      if (canalData.features[i].geometry) {
        let zbcArr = canalData.features[i].geometry.coordinates;
        let newZbcArr = [];
        zbcArr.forEach((item) => {
          newZbcArr.push([item[0], item[1]]);
        });
        let imgUrl = null;
        let color = null;
        let widthCoefficient = 0;
        let times = 0;
        let fluidConfig = null;
        let time = null;
        if (feature.properties.layer.indexOf("支渠") >= 0) {
          color = "#EBFFE4";
          imgUrl = polylineEffect30;
          widthCoefficient = 10;
          times = Math.ceil(length / 1000);
          time = Math.ceil(length / 1000) * 1000;
          fluidConfig = [
            {
              range: [100000, 10000000],
              times: Math.ceil(times / 2),
              time: time / 2,
            },
            {
              range: [50000, 100000],
              times: Math.ceil(times / 1.5),
              time: time / 1.5,
            },
            {
              range: [20000, 50000],
              times: Math.ceil(times * 1.5),
              time: time * 1.5,
            },
            {
              range: [10000, 20000],
              times: Math.ceil(times * 2),
              time: time * 2,
            },
            {
              range: [5000, 10000],
              times: Math.ceil(times * 2.5),
              time: time * 2.5,
            },
            {
              range: [3000, 5000],
              times: Math.ceil(times * 3),
              time: time * 3,
            },
            {
              range: [0, 3000],
              times: Math.ceil(times * 5),
              time: time * 5,
            },
          ];

          let option1 = {
            color: color,
            widthCoefficient: widthCoefficient,
            imgUrl: imgUrl,
            showBackPolyline: false,
            fluidConfig: fluidConfig,
            type: "branch",
          };
          this.arrowPolylineFluid.addPolylineFluid(newZbcArr, option1);
        }
      }
    }
    console.log("this.arrowPolylineFluid", this.arrowPolylineFluid);
  }

  deleteMainCanalPolylineFluid() {
    console.log("deleteMainCanalPolylineFluid", this.mainCanalPolylineFluid);
    //MainCanalPolylineFluid
    if (this.mainCanalPolylineFluid) {
      for (
        let i = 0;
        i < this.mainCanalPolylineFluid.polylineFluidEntityArr.length;
        i++
      ) {
        this.ffCesium.viewer.entities.remove(
          this.mainCanalPolylineFluid.polylineFluidEntityArr[i]
        );
      }
      //移除事件
      this.mainCanalPolylineFluid.polylineFluidHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.WHEEL
      );
      this.mainCanalPolylineFluid = null;
    }
  }

  /**
   * 叠加主渠
   */
  addCanal() {
    this.mainCanalPolylineFluid = new PolylineFluid(this.ffCesium);
    // console.log("个数：", canalData.features.length);
    for (let i = 0; i < canalData.features.length; i++) {
      let feature = canalData.features[i];
      var length = turf.length(feature, { units: "meters" });
      // console.log("长度：", length);
      //console.log("feature", feature);
      if (canalData.features[i].geometry) {
        let zbcArr = canalData.features[i].geometry.coordinates;
        let newZbcArr = [];
        zbcArr.forEach((item) => {
          newZbcArr.push([item[0], item[1]]);
        });
        let imgUrl = null;
        let color = null;
        let widthCoefficient = 0;
        let times = 0;
        let fluidConfig = null;
        let time = null;
        if (feature.properties.layer.indexOf("干渠") >= 0) {
          color = "#9AFEFE";
          imgUrl = polylineEffect9;
          widthCoefficient = 10;
          times = 1;
          fluidConfig = [
            {
              range: [100000, 20000000],
              times: times,
              time: 3000,
            },
            {
              range: [50000, 100000],
              times: times,
              time: 15000,
            },
            {
              range: [20000, 50000],
              times: times,
              time: 30000,
            },
            {
              range: [5000, 20000],
              times: times,
              time: 50000,
            },
            {
              range: [2500, 5000],
              times: Math.ceil(times * 1.2),
              time: 100000,
            },
            {
              range: [0, 2500],
              times: Math.ceil(times * 1.5),
              time: 120000,
            },
            {
              range: [0, 500],
              times: Math.ceil(times * 2),
              time: 150000,
            },
          ];

          let option1 = {
            color: color,
            widthCoefficient: widthCoefficient,
            imgUrl: imgUrl,
            showBackPolyline: false,
            fluidConfig: fluidConfig,
            type: "canal",
          };
          this.mainCanalPolylineFluid.addPolylineFluid(newZbcArr, option1);
        }
      }
    }
  }
}

export default PolylineEffect;
