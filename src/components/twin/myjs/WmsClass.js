import * as Cesium from "cesium";
//地图类型
class WmsClass {
  ffCesium;
  url = "http://192.168.9.212:8080/geoserver/sl/wms";
  jmssxWMSLayer;
  areaWMSLayer;
  mainCanalWMSLayer;
  branchCanalWMSLayer = null;
  massifWmsLayer = null;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  heightMonitor() {
    let the = this;
    //高度监听
    this.polylineFluidHandler = new Cesium.ScreenSpaceEventHandler(
      this.ffCesium.viewer.scene.canvas
    );
    this.polylineFluidHandler.setInputAction((wheelment) => {
      var height = this.ffCesium.viewer.camera.positionCartographic.height;
      console.log("高度1", height);
      if (height < 50000) {
        //显示支渠
        the.branchCanalWMSLayer.show = true;
        the.massifWmsLayer.show = true;
      } else {
        the.branchCanalWMSLayer.show = false;
        the.massifWmsLayer.show = false;
      }
    }, Cesium.ScreenSpaceEventType.WHEEL);
  }

  addDefaultWMS() {
    this.addMassifWMS();
    this.addBranchCanalWMS();
    this.addJmssxWMS();
    //this.addAreaWMS();
    this.addMainCanalWMS();
    this.heightMonitor();
  }

  //地块
  addMassifWMS() {
    let layerName = "sl:dk";
    this.massifWmsLayer = this.ffCesium.addWmslayer(this.url, layerName);
    this.massifWmsLayer.show = false;
  }
  //支渠
  addBranchCanalWMS() {
    let wmsOption = {
      url: this.url,
      layers: "sl:qx",
      parameters: {
        transparent: true, //透明配置
        service: "WMS",
        format: "image/png",
        cql_filter: "layer like '%支渠%'",
      },
    };
    this.branchCanalWMSLayer = this.ffCesium.findWmsLayer(wmsOption);
    this.branchCanalWMSLayer.show = false;
  }
  //移除支渠
  removeBranchCanalWMS() {
    console.log("移除支渠removeBranchCanalWMS", this.branchCanalWMSLayer);
    if (this.branchCanalWMSLayer) {
      this.ffCesium.removeMapLayer(this.branchCanalWMSLayer);
      this.branchCanalWMSLayer = null;
    }
  }
  //干渠
  addMainCanalWMS() {
    let wmsOption = {
      url: this.url,
      layers: "sl:qx",
      parameters: {
        transparent: true, //透明配置
        service: "WMS",
        format: "image/png",
        cql_filter: "layer not like '%支渠%'",
      },
    };
    this.mainCanalWMSLayer = this.ffCesium.findWmsLayer(wmsOption);
  }
  //边界
  addAreaWMS() {
    let layerName = "sl:tyxbj";
    this.areaWMSLayer = this.ffCesium.addWmslayer(this.url, layerName);
  }
  //水系
  addJmssxWMS() {
    let layerName = "sl:jmssx";
    this.jmssxWMSLayer = this.ffCesium.addWmslayer(this.url, layerName);
  }
}
export default WmsClass;
