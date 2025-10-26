import * as Cesium from "cesium";
//点线面采集方法
export const mapServer = {
  /**
   * 添加高德地图图层
   * 通过此函数，可以将高德地图的图层添加到Cesium的视图中。
   * 这使得用户能够在Cesium的3D地球视图中看到高德地图的数据。
   *
   * @param {String} url 高德地图的URL模板。这个URL应该包含高德地图的瓦片编号信息，
   *                     以便Cesium能够根据需要加载不同的地图瓦片。
   * @returns {Cesium.UrlTemplateImageryProvider} 返回一个Cesium的URL模板影像提供程序对象。
   *         这个对象被用于实际提供地图瓦片给Cesium的视图。
   */
  addGaodeLayer(url) {
    var imgProvider = new Cesium.UrlTemplateImageryProvider({ url: url });
    this.viewer.imageryLayers.addImageryProvider(imgProvider);
    return imgProvider;
  },
  /**
   * 添加天地图平面地图加载
   *
   * 本函数通过构造一个指向天地图矢量数据服务的URL，并调用addTdtLayer方法来添加该图层。
   * URL中包含了服务的基本信息，如服务类型、版本、图层、样式、矩阵集、格式等参数。
   * 其中，tk参数是天地图的访问密钥，用于身份验证和访问控制。
   *
   * @returns {Layer} 返回添加的图层对象。
   */
  addTdtVecLayer() {
    let url =
      "http://112.48.26.30:24518/tdt/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa";
    return this.addTdtLayer(url);
  },

  /**
   * 加载天地图平面注记地图加载
   *
   *
   * @returns {Layer} 返回添加的CVA层。
   */
  addTdtCvaLayer() {
    let url =
      "http://112.48.26.30:24518/tdt/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa";
    return this.addTdtLayer(url);
  },

  /**
   * 添加天地图影像图层
   *
   * @returns {Layer} 返回添加的影像图层对象
   */
  addTdtImgLayer() {
    let url =
      "http://112.48.26.30:24518/tdt/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa";
    return this.addTdtLayer(url);
  },

  /**
   * 天地图影像地图加载
   *
   * 本函数通过构造并返回一个URL，该URL指向天地图的WMTS服务，以获取特定区域的影像地图切片。
   * 使用这个函数，可以在地图应用程序中集成天地图的影像数据。
   *
   * @returns {Layer} 返回一个新增的天地图影像地图层。
   */
  addTdtCiaLayer() {
    let url =
      "http://112.48.26.30:24518/tdt/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa";
    return this.addTdtLayer(url);
  },

  /**
   * 天地图道路地图加载
   *
   * @returns {Layer} 返回添加的影像图层对象
   */
  addTdtCtaLayer() {
    let url =
      "http://112.48.26.30:24518/tdt/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e7a6694e4622933c3a2bd66ba10233aa";
    return this.addTdtLayer(url);
  },

  /**
   * 其他天地图服务
   * @param {string} url - 天地图服务的URL模板
   * @returns {ImageryLayer} - 添加的天地图图层对象
   *
   * 本函数用于向当前的Cesium视图中添加一个天地图图层。它通过传入的URL创建一个 ImageryProvider，
   * 并将其添加到影像图层列表中。返回添加的图层对象，允许进一步的配置或操作。
   */
  addTdtLayer(url) {
    var mapOption = {
      url: url,
    };
    var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);
    let mapLayer = this.viewer.imageryLayers.addImageryProvider(imgProvider);
    return mapLayer;
  },

  /**
   * 加载ArcGIS影像图层。
   *
   * 本函数通过指定ArcGIS Online上的World_Imagery服务地址，添加一个影像图层到地图中。
   * 它利用ArcGIS REST服务的瓦片地址模式，通过{z}/{y}/{x}的占位符方式，动态构建每个瓦片的URL。
   *
   * @returns {CustomLayer} 返回添加的自定义图层，以便进一步的操作或引用。
   */
  addArcgisImgLayer() {
    let url =
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return this.addCustomLayer(url);
  },

  /**
   * 添加自定义地图图层
   * 通过此函数，可以向当前的地图视图中添加一个新的自定义地图图层。这允许用户根据自己的需求
   * 或者数据源来扩展地图的可视化表现。
   *
   * @param {string} url - 自定义地图图层的URL模板。这个URL应该指向一个图片或者一个图片的模板，
   *                       用于在地图上显示这个图层。
   * @returns {ImageryLayer} 返回添加的自定义地图图层对象。这个对象可以用于进一步的操作，比如
   *                         调整图层的透明度或者显示顺序。
   */
  addCustomLayer(url) {
    var mapOption = {
      url: url,
    };
    var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);
    let mapLayer = this.viewer.imageryLayers.addImageryProvider(imgProvider);
    return mapLayer;
  },

  /**
   * 添加WMS图层
   * 通过此函数可以向Cesium的视图中添加Web Map Service (WMS) 图层。
   * WMS是一种标准的OGC协议，用于从服务器获取地图图像。
   *
   * @param {String} url WMS服务的URL，必须是支持WMS协议的服务器地址。
   * @param {String} layerName 需要添加的具体图层名称，此名称取决于服务器上提供的WMS服务。
   * @returns {ImageryLayer} 返回添加的WMS图层对象，此对象可以在进一步的操作中被引用。
   */
  addWmslayer(url, layerName) {
    var wms = new Cesium.WebMapServiceImageryProvider({
      url: url,
      layers: layerName,
      parameters: {
        transparent: true, //透明配置
        service: "WMS",
        format: "image/png",
        srs: "EPSG:4326",
      },
    });
    let wmsLayer = this.viewer.imageryLayers.addImageryProvider(wms);
    return wmsLayer;
  },
  /**
   * 添加WMS图层
   * 通过此函数可以向Cesium的视图中添加Web Map Service (WMS) 图层。
   * WMS是一种标准的OGC协议，用于从服务器获取地图图像。
   *
   * @param {Object} option - WMS服务的配置选项
   * @returns {ImageryLayer} 返回添加的WMS图层对象，此对象可以在进一步的操作中被引用。
   */
  findWmsLayer(option) {
    let webMapTemp = new Cesium.WebMapServiceImageryProvider(option);
    let wmsLayer = this.viewer.imageryLayers.addImageryProvider(webMapTemp);
    return wmsLayer;
  },

  /**
   * 移除地图图层
   * @param {Object} mapLayer - 要移除的地图图层对象
   * 此函数用于从地图中移除指定的影像图层。它通过调用viewer的imageryLayers对象的remove方法来实现。
   * 参数mapLayer指定要移除的图层对象。移除操作完成后，图层将不再显示在地图上。
   * 设置第二个参数为true，表示在移除图层后立即刷新地图，确保地图视图的更新。
   */
  removeMapLayer(mapLayer) {
    this.viewer.imageryLayers.remove(mapLayer, true);
  },
  hideMapLayer() {},
};
