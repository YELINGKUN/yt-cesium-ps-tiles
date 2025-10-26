import * as Cesium from "cesium";
class PolygonEffect {
  ffCesium;
  polygon1 = [
    [129.67527276450906, 46.64640447874822],
    [129.67358135043708, 46.607438144042945],
    [129.741716858189, 46.60838832938482],
    [129.74731883667283, 46.64926618215574],
  ];

  polygon2 = [
    [129.741716858189, 46.60838832938482],
    [129.74731883667283, 46.64926618215574],
    [129.80166214354293, 46.6538090729016],
    [129.84955372853815, 46.665342283058145],
    [129.84622917428229, 46.617225758660624],
  ];

  polygon3 = [
    [129.741716858189, 46.60838832938482],
    [129.84622917428229, 46.617225758660624],
    [129.81757328548858, 46.58813423164311],
    [129.7312851113514, 46.566987168443596],
  ];

  polygon4 = [
    [129.67358135043708, 46.607438144042945],
    [129.741716858189, 46.60838832938482],
    [129.7312851113514, 46.566987168443596],
  ];

  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  addHandler() {
    let the = this;
    //高度监听
    this.polylineFluidHandler = new Cesium.ScreenSpaceEventHandler(
      this.ffCesium.viewer.scene.canvas
    );
    let viewer = this.ffCesium.viewer;
    this.polylineFluidHandler.setInputAction((event) => {
      //获取加载地形后对应的经纬度和高程：地标坐标
      var ray = viewer.camera.getPickRay(event.position);
      var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        // 转换为经纬度
        const cartographic =
          viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        const longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        const latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        const height = viewer.scene.globe.getHeight(cartographic);
        // 输出点击的经纬度和高度
        console.log("采集坐标：" + longitudeString + "," + latitudeString);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  addPolygon() {
    let polygonEntity1 = this.ffCesium.viewer.entities.add({
      polygon: {
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(this.polygon1.flat()),
        },
        material: Cesium.Color.fromCssColorString("#C3F6FF").withAlpha(0.8),
      },
    });
    //this.addLabel(this.polygon1);

    let polygonEntity2 = this.ffCesium.viewer.entities.add({
      polygon: {
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(this.polygon2.flat()),
        },
        material: Cesium.Color.fromCssColorString("#FFFF00").withAlpha(0.8),
      },
    });
    //this.addLabel(this.polygon2);

    let polygonEntity3 = this.ffCesium.viewer.entities.add({
      polygon: {
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(this.polygon3.flat()),
        },
        material: Cesium.Color.fromCssColorString("#FF00FF").withAlpha(0.8),
      },
    });
    //this.addLabel(this.polygon3);

    let polygonEntity4 = this.ffCesium.viewer.entities.add({
      polygon: {
        hierarchy: {
          positions: Cesium.Cartesian3.fromDegreesArray(this.polygon4.flat()),
        },
        material: Cesium.Color.fromCssColorString("#0E421F").withAlpha(0.8),
      },
    });
    //this.addLabel(this.polygon4);
  }
  addLabel(polygonArr) {
    for (let i = 0; i < polygonArr.length; i++) {
      var label = this.ffCesium.viewer.entities.add({
        // 位置
        position: Cesium.Cartesian3.fromDegrees(
          polygonArr[i][0],
          polygonArr[i][1]
        ),
        // 实体类型
        label: {
          // 文本
          text: polygonArr[i][0] + "," + polygonArr[i][1],
          // 样式
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          // 字体
          font: "12px monospace",
          // 文本边界的宽度
          outlineWidth: 5,
          pixelOffset: new Cesium.Cartesian2(-100, -110),
        },
      });
    }
  }
}

export default PolygonEffect;
