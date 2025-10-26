import * as Cesium from "cesium";
//import areaJSON from "../data/area.json";
import areaJSON from "../data/newArea.json";
class OtherClass {
  ffCesium;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  //点击地图获取坐标
  addClickHandlerForGetXY() {
    let viewer = this.ffCesium.viewer;
    var riverHandle = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // 对鼠标按下事件的监听
    riverHandle.setInputAction(function (event) {
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
  //叠加辖区边界
  addXiaQUBoundary() {
    console.log("addXiaQUBoundary--areaJSON", areaJSON);
    //let zbc = areaJSON.coordinates[0][0];
    let zbc = areaJSON.features[0].geometry.coordinates[0][0];
    console.log("addXiaQUBoundary--zbc", zbc);
    let entityTemp = this.ffCesium.viewer.entities.add({
      polyline: {
        clampToGround: true,
        positions: Cesium.Cartesian3.fromDegreesArray(zbc.flat()),
        width: 2,
        material: Cesium.Color.fromCssColorString("#C3F6FF").withAlpha(0.8),
      },
    });

    let holeArr = [
      {
        positions: Cesium.Cartesian3.fromDegreesArray(zbc.flat()),
      },
    ];
    // 遮罩
    console.log("holeArr", holeArr);
    let polygonEntity = new Cesium.Entity({
      polygon: {
        hierarchy: {
          // 添加外部区域为1/4半圆，设置为180会报错
          positions: Cesium.Cartesian3.fromDegreesArray([
            73, 20, 73, 53, 135, 53, 135, 20,
          ]),
          // 中心挖空的“洞”
          holes: holeArr,
        },
        material: Cesium.Color.fromCssColorString("#0F2654").withAlpha(0.8),
        // material: Cesium.Color.TRANSPARENT.withAlpha(0.0),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    this.ffCesium.viewer.entities.add(polygonEntity);
  }
}
export default OtherClass;
