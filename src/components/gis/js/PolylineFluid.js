import PolylineFlow from "./polylineFlow.js";
import * as Cesium from "cesium";
import flickerBase64 from "../images/flicker2.png";
//import flickerBase64 from "../images/river.png";

class PolylineFluid {
  ffCesium;
  polylineFluidEntityArr = [];
  polylineFluidHandler;
  constructor(ffCesium) {
    this.polylineFluidEntityArr = [];
    this.ffCesium = ffCesium;
    this.heightMonitor();
  }
  heightMonitor() {
    let the = this;
    //高度监听
    this.polylineFluidHandler = new Cesium.ScreenSpaceEventHandler(
      this.ffCesium.viewer.scene.canvas
    );
    this.polylineFluidHandler.setInputAction((wheelment) => {
      var height = this.ffCesium.viewer.camera.positionCartographic.height;
      for (let i = 0; i < the.polylineFluidEntityArr.length; i++) {
        let option = the.polylineFluidEntityArr[i].option;
        let oldTimes = option.times;
        the.getConfig(height, option);
        if (option.times != oldTimes) {
          the
            .copyImagesTime(option.imgUrl, option.times)
            .then((mergedBase64) => {
              let newPolygonFlowObj = new PolylineFlow(
                Cesium.Color.fromCssColorString(option.color),
                mergedBase64,
                option.time
              );
              the.polylineFluidEntityArr[i].polyline.material =
                newPolygonFlowObj;
            });
        }
      }
    }, Cesium.ScreenSpaceEventType.WHEEL);
  }

  addPolylineFluid(lnglatArr, option) {
    if (option.showBackPolyline == true) {
      this.addPolylineFlickerByEntity(lnglatArr, option);
    }
    let the = this;
    let heightTemp = this.ffCesium.viewer.camera.positionCartographic.height;
    console.log("addPolylineFluid--相机高度", heightTemp);
    this.getConfig(heightTemp, option);
    let promise = this.copyImagesTime(option.imgUrl, option.times).then(
      (mergedBase64) => {
        //console.log("mergeBase64Images", mergedBase64); // 输出合并后的Base64编码的图片
        //宽度
        option.width = new Cesium.CallbackProperty(function (time, result) {
          // 获取相机的当前位置
          var height = the.ffCesium.viewer.camera.positionCartographic.height;
          // 根据距离计算宽度
          result = option.widthCoefficient + 100000 / height; // 这里假设宽度与距离成反比，距离越大，宽度越小
          if (result > 100) {
            result = 100;
          }
          return result;
        }, false);
        option.img = mergedBase64;
        let EntityTemp = this.addPolylineFlow(lnglatArr, option);
        EntityTemp.option = option;
        the.polylineFluidEntityArr.push(EntityTemp);
      }
    );
    return promise;
  }

  addPolylineFlow(lnglatArr, option) {
    console.log("addPolylineFlow--option", option);
    let polygonFlowObj = new PolylineFlow(
      Cesium.Color.fromCssColorString(option.color),
      option.img,
      option.time
    );
    let entityTemp = this.ffCesium.viewer.entities.add({
      polyline: {
        clampToGround: true,
        positions: Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat()),
        width: option.width,
        material: polygonFlowObj,
      },
    });
    return entityTemp;
  }
  //添加闪烁线
  addPolylineFlickerByEntity(lnglatArr, option) {
    let the = this;
    let FFentity = this.ffCesium.viewer.entities.add({
      show: true,
      polyline: {
        clampToGround: true,
        positions: Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat()),
        width: option.widthCoefficient,
        material: Cesium.Color.fromCssColorString(option.color),
      },
    });
    FFentity.flickerFlag = 1;
    FFentity.flickerChangeFlag = "minus";
    FFentity.polyline = {
      clampToGround: true,
      positions: FFentity.polyline.positions,
      width: new Cesium.CallbackProperty(function (time, result) {
        // 获取相机的当前位置
        var height = the.ffCesium.viewer.camera.positionCartographic.height;
        // 根据距离计算宽度
        result = option.widthCoefficient + 5 + 100000 / height; // 这里假设宽度与距离成反比，距离越大，宽度越小
        if (result > 200) {
          result = 200;
        }
        return result;
      }, false),
      material: new Cesium.ImageMaterialProperty({
        image: flickerBase64,
        color: new Cesium.CallbackProperty(function () {
          return Cesium.Color.fromCssColorString(option.color).withAlpha(1);
        }, false),
        repeat: new Cesium.Cartesian2(1.0, 1.0),
        transparent: true,
      }),
    };
    FFentity.addType = option.addType;
    return FFentity;
  }

  getConfig(height, option) {
    for (let i = 0; i < option.fluidConfig.length; i++) {
      if (
        height >= option.fluidConfig[i].range[0] &&
        height <= option.fluidConfig[i].range[1]
      ) {
        option.times = option.fluidConfig[i].times;
        option.time = option.fluidConfig[i].time;
      }
    }
  }
  copyImagesTime(base64Image, num) {
    return new Promise((resolve, reject) => {
      function createImage(base64) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            //console.log(`Loaded image with size: ${img.width}x${img.height}`);
            resolve(img);
          };
          img.onerror = (error) => {
            console.error("Error loading image:", error);
            reject(error);
          };
          img.src = base64;
        });
      }
      let arrTemp = [];
      for (let i = 0; i < num; i++) {
        arrTemp.push(createImage(base64Image));
      }

      Promise.all(arrTemp)
        .then((arr) => {
          //console.log("arr", arr);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // canvas.width = Math.max(img1.width, img2.width);
          // canvas.height = img1.height + img2.height;

          canvas.width = arr[0].width * num;
          canvas.height = arr[0].height;

          ctx.drawImage(arr[0], 0, 0);

          for (let i = 1; i < num; i++) {
            ctx.drawImage(arr[0], arr[0].width * i, 0);
          }
          const mergedBase64 = canvas.toDataURL("image/png");
          resolve(mergedBase64);
        })
        .catch((error) => {
          console.error("Error merging images:", error);
          reject(error);
        });
    });
  }
}

export default PolylineFluid;
