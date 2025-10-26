/**
 * 图层管理器集成配置
 * 将图层管理功能集成到CesiumPlus主框架中
 */

import layerManager from "./layerManager.js";
import layerManagerExample from "./layerManagerExample.js";

/**
 * 图层管理扩展
 * 为CesiumPlus添加图层管理功能
 */
export const layerManagerExtension = {
  /**
   * 初始化图层管理扩展
   * @param {Object} cesiumPlus - CesiumPlus实例
   */
  init(cesiumPlus) {
    // 初始化图层管理器
    layerManager.init(cesiumPlus.viewer);

    // 将图层管理器添加到CesiumPlus实例
    cesiumPlus.layerManager = layerManager;

    // 扩展CesiumPlus的实体添加方法
    this.extendEntityMethods(cesiumPlus);

    // 添加图层管理快捷方法
    this.addLayerShortcuts(cesiumPlus);

    console.log("图层管理扩展初始化完成");
  },

  /**
   * 扩展实体添加方法
   * @param {Object} cesiumPlus - CesiumPlus实例
   */
  extendEntityMethods(cesiumPlus) {
    // 保存原始方法
    const originalAddPointEntity = cesiumPlus.addPointEntity;
    const originalAddBillboardEntity = cesiumPlus.addBillboardEntity;
    const originalAddPolylineEntity = cesiumPlus.addPolylineEntity;
    const originalAddPolygonEntity = cesiumPlus.addPolygonEntity;
    const originalAddCircleEntity = cesiumPlus.addCircleEntity;
    const originalAddRectangleEntity = cesiumPlus.addRectangleEntity;

    // 扩展点实体添加方法
    cesiumPlus.addPointEntity = function (
      lngLatHeight,
      option,
      layerName = "default"
    ) {
      const entity = originalAddPointEntity.call(this, lngLatHeight, option);

      // 确保默认图层存在
      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      // 添加到指定图层
      layerManager.addEntityToLayer(layerName, entity, {
        type: "point",
        ...option,
      });

      return entity;
    };

    // 扩展广告牌实体添加方法
    cesiumPlus.addBillboardEntity = function (
      lngLatHeight,
      option,
      layerName = "default"
    ) {
      const entity = originalAddBillboardEntity.call(
        this,
        lngLatHeight,
        option
      );

      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      layerManager.addEntityToLayer(layerName, entity, {
        type: "billboard",
        ...option,
      });

      return entity;
    };

    // 扩展线实体添加方法
    cesiumPlus.addPolylineEntity = function (
      lnglatArr,
      option,
      layerName = "default"
    ) {
      const entity = originalAddPolylineEntity.call(this, lnglatArr, option);

      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      layerManager.addEntityToLayer(layerName, entity, {
        type: "polyline",
        ...option,
      });

      return entity;
    };

    // 扩展多边形实体添加方法
    cesiumPlus.addPolygonEntity = function (
      lnglatArr,
      option,
      layerName = "default"
    ) {
      const entity = originalAddPolygonEntity.call(this, lnglatArr, option);

      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      layerManager.addEntityToLayer(layerName, entity, {
        type: "polygon",
        ...option,
      });

      return entity;
    };

    // 扩展圆形实体添加方法
    cesiumPlus.addCircleEntity = function (
      lngLatHeight,
      option,
      layerName = "default"
    ) {
      const entity = originalAddCircleEntity.call(this, lngLatHeight, option);

      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      layerManager.addEntityToLayer(layerName, entity, {
        type: "circle",
        ...option,
      });

      return entity;
    };

    // 扩展矩形实体添加方法
    cesiumPlus.addRectangleEntity = function (
      lnglatArr,
      option,
      layerName = "default"
    ) {
      const entity = originalAddRectangleEntity.call(this, lnglatArr, option);

      if (!layerManager.hasLayer(layerName)) {
        layerManager.createLayer(layerName, {
          description: "默认图层",
          tags: ["default"],
        });
      }

      layerManager.addEntityToLayer(layerName, entity, {
        type: "rectangle",
        ...option,
      });

      return entity;
    };
  },

  /**
   * 添加图层管理快捷方法
   * @param {Object} cesiumPlus - CesiumPlus实例
   */
  addLayerShortcuts(cesiumPlus) {
    // 图层创建快捷方法
    cesiumPlus.createLayer = function (name, options) {
      return layerManager.createLayer(name, options);
    };

    // 图层切换快捷方法
    cesiumPlus.toggleLayer = function (name, visible) {
      return layerManager.toggleLayer(name, visible);
    };

    // 图层透明度设置快捷方法
    cesiumPlus.setLayerOpacity = function (name, opacity) {
      return layerManager.setLayerOpacity(name, opacity);
    };

    // 图层清空快捷方法
    cesiumPlus.clearLayer = function (name) {
      return layerManager.clearLayer(name);
    };

    // 图层移除快捷方法
    cesiumPlus.removeLayer = function (name) {
      return layerManager.removeLayer(name);
    };

    // 获取图层快捷方法
    cesiumPlus.getLayer = function (name) {
      return layerManager.getLayer(name);
    };

    // 获取所有图层快捷方法
    cesiumPlus.getAllLayers = function () {
      return layerManager.getAllLayers();
    };

    // 批量操作快捷方法
    cesiumPlus.batchLayerOperation = function (layerNames, operation, value) {
      return layerManager.batchOperation(layerNames, operation, value);
    };

    // 图层统计快捷方法
    cesiumPlus.getLayerStatistics = function () {
      return layerManager.getStatistics();
    };

    // 图层搜索快捷方法
    cesiumPlus.searchLayers = function (keyword) {
      const allLayers = layerManager.getAllLayers();
      return allLayers.filter(
        (layer) =>
          layer.name.toLowerCase().includes(keyword.toLowerCase()) ||
          layer.description.toLowerCase().includes(keyword.toLowerCase()) ||
          layer.tags.some((tag) =>
            tag.toLowerCase().includes(keyword.toLowerCase())
          )
      );
    };

    // 图层导出快捷方法
    cesiumPlus.exportLayerConfig = function (layerName) {
      return layerManager.exportLayerConfig(layerName);
    };

    // 图层导入快捷方法
    cesiumPlus.importLayerConfig = function (config) {
      return layerManager.importLayerConfig(config);
    };
  },

  /**
   * 创建预定义图层
   * @param {Object} cesiumPlus - CesiumPlus实例
   */
  createPredefinedLayers(cesiumPlus) {
    // 创建常用图层
    const predefinedLayers = [
      {
        name: "buildings",
        options: {
          description: "建筑物图层",
          tags: ["3D", "building", "infrastructure"],
          opacity: 0.8,
          zIndex: 10,
        },
      },
      {
        name: "roads",
        options: {
          description: "道路图层",
          tags: ["2D", "infrastructure", "transportation"],
          opacity: 0.9,
          zIndex: 5,
        },
      },
      {
        name: "pois",
        options: {
          description: "兴趣点图层",
          tags: ["2D", "point", "business"],
          opacity: 1.0,
          zIndex: 15,
        },
      },
      {
        name: "water",
        options: {
          description: "水体图层",
          tags: ["2D", "water", "natural"],
          opacity: 0.7,
          zIndex: 3,
        },
      },
      {
        name: "vegetation",
        options: {
          description: "植被图层",
          tags: ["2D", "vegetation", "natural"],
          opacity: 0.8,
          zIndex: 2,
        },
      },
    ];

    predefinedLayers.forEach(({ name, options }) => {
      if (!layerManager.hasLayer(name)) {
        layerManager.createLayer(name, options);
      }
    });

    console.log("预定义图层创建完成");
  },

  /**
   * 销毁图层管理扩展
   */
  destroy() {
    layerManager.destroy();
    console.log("图层管理扩展已销毁");
  },
};

// 导出扩展
export default layerManagerExtension;
