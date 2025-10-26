import * as Cesium from "cesium";
//点线面采集方法
export const dataServer = {
  /**
   * 异步添加倾斜摄影服务。
   * @param {string} url - 倾斜摄影数据的URL。
   * @param {Object} option - 添加倾斜摄影数据时的选项。
   * @returns {Promise} 返回一个Promise，解析为添加的倾斜摄影数据集对象。
   */
  async addObliquePhotography(url, option) {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
      this.viewer.scene.primitives.add(tileset);
      return tileset;
    } catch (error) {
      console.log(`Error loading tileset: ${error}`);
    }
  },
  /**
   * 移除指定的倾斜摄影数据集。
   * @param {Cesium.Cesium3DTileset} tileset - 要移除的倾斜摄影数据集对象。
   */
  removeObliquePhotography(tileset) {
    this.viewer.scene.primitives.remove(tileset);
  },
  /**
   * 异步添加地形服务。
   * @param {string} url - 地形数据的URL。
   * @returns {Promise} 返回一个Promise，解析为添加的地形提供者对象。
   */
  async addTerrain(url) {
    try {
      var terrainLayer = await Cesium.CesiumTerrainProvider.fromUrl(url, {});
      this.viewer.scene.terrainProvider = terrainLayer;
      return terrainLayer;
    } catch (error) {
      console.log(`Error loading tileset: ${error}`);
    }
  },
  /**
   * 移除当前的地形服务，使用椭球体地形提供者作为替代。
   */
  removeTerrain() {
    this.viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();
  },
  /**
   * 解析geojson数据
   * @param {Object} geojson - GeoJSON数据对象。
   * @returns {Promise} 返回一个Promise，解析为加载的GeoJSON数据源对象。
   */
  readGeojson(geojson) {
    let promise = Cesium.GeoJsonDataSource.load(geojson);
    return promise;
  },
  /**
   * 添加GeoJSON数据源到视图中，并配置其样式。
   * @param {Cesium.GeoJsonDataSource} dataSource - 要添加的GeoJSON数据源对象。
   * @param {Object} option - 配置数据源样式的选项。
   * @returns {Cesium.GeoJsonDataSource} 返回添加的GeoJSON数据源对象。
   */
  addGeojson(dataSource, option) {
    this.viewer.dataSources.add(dataSource);
    option.stroke = Cesium.Color.fromCssColorString(option.stroke);
    option.fill = Cesium.Color.fromCssColorString(option.fill).withAlpha(
      option.fillAlpha
    );
    dataSource.entities.values.forEach(function (entity) {
      if (entity.polygon) {
        entity.polygon.outline = false;
        entity.polygon.material = option.fill;
        entity.polyline = {
          positions: entity.polygon.hierarchy._value.positions,
          width: option.strokeWidth,
          material: option.stroke,
        };
      }
    });
    return dataSource;
  },

  /**
   * 解析kml数据
   * @param {string} kml - KML数据的URL或字符串。
   * @param {Object} option - 加载KML数据时的选项。
   * @returns {Promise} 返回一个Promise，解析为加载的KML数据源对象。
   */
  readKml(kml) {
    let promise = Cesium.KmlDataSource.load(kml, {
      camera: this.viewer.scene.camera,
      canvas: this.viewer.scene.canvas,
      screenOverlayContainer: this.viewer.container,
    });
    return promise;
  },
  /**
   * 添加KML数据源到视图中。
   * @param {Cesium.KmlDataSource} dataSource - 要添加的KML数据源对象。
   * @returns {Cesium.KmlDataSource} 返回添加的KML数据源对象。
   */
  addKml(dataSource) {
    this.viewer.dataSources.add(dataSource);
    return dataSource;
  },

  /**
   * 从视图中移除指定的数据源。
   * @param {Cesium.DataSource} dataSource - 要移除的数据源对象。
   */
  removeDataSource(dataSource) {
    this.viewer.dataSources.remove(dataSource);
  },
};
