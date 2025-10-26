import * as Cesium from "cesium";
import layerManager from "./layerManager.js";

/**
 * 图层管理器使用示例
 * 展示如何使用优化后的图层管理功能
 */
export const layerManagerExample = {
  /**
   * 初始化示例
   */
  initExample(viewer) {
    // 初始化图层管理器
    layerManager.init(viewer);

    // 监听图层事件
    this.setupEventListeners();

    console.log("图层管理器示例初始化完成");
  },

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听图层创建事件
    layerManager.on("layerCreated", (data) => {
      console.log(`图层创建: ${data.layerName}`, data.layer);
    });

    // 监听实体添加事件
    layerManager.on("entityAdded", (data) => {
      console.log(`实体添加到图层 ${data.layerName}:`, data.entity);
    });

    // 监听图层切换事件
    layerManager.on("layerToggled", (data) => {
      console.log(`图层 ${data.layerName} ${data.visible ? "显示" : "隐藏"}`);
    });

    // 监听图层清空事件
    layerManager.on("layerCleared", (data) => {
      console.log(
        `图层 ${data.layerName} 清空，移除了 ${data.entityCount} 个实体`
      );
    });
  },

  /**
   * 基础图层管理示例
   */
  basicLayerManagement() {
    console.log("=== 基础图层管理示例 ===");

    // 1. 创建不同类型的图层
    const buildingLayer = layerManager.createLayer("buildings", {
      description: "建筑物图层",
      tags: ["3D", "building"],
      opacity: 0.8,
      zIndex: 10,
    });

    const roadLayer = layerManager.createLayer("roads", {
      description: "道路图层",
      tags: ["2D", "infrastructure"],
      opacity: 0.9,
      zIndex: 5,
    });

    const poiLayer = layerManager.createLayer("pois", {
      description: "兴趣点图层",
      tags: ["2D", "point"],
      opacity: 1.0,
      zIndex: 15,
    });

    // 2. 添加实体到图层
    this.addSampleEntities();

    // 3. 图层控制
    layerManager.toggleLayer("buildings", false); // 隐藏建筑物
    layerManager.setLayerOpacity("roads", 0.5); // 设置道路透明度

    // 4. 获取图层信息
    console.log("所有图层:", layerManager.getAllLayers());
    console.log("图层统计:", layerManager.getStatistics());
  },

  /**
   * 添加示例实体
   */
  addSampleEntities() {
    // 添加建筑物实体
    const building1 = this.createSampleBuilding([116.3974, 39.9093, 100]);
    layerManager.addEntityToLayer("buildings", building1, {
      type: "office",
      height: 100,
    });

    const building2 = this.createSampleBuilding([116.4074, 39.9193, 80]);
    layerManager.addEntityToLayer("buildings", building2, {
      type: "residential",
      height: 80,
    });

    // 添加道路实体
    const road1 = this.createSampleRoad([
      [116.3974, 39.9093],
      [116.4074, 39.9193],
      [116.4174, 39.9293],
    ]);
    layerManager.addEntityToLayer("roads", road1, {
      type: "highway",
      width: 20,
    });

    // 添加兴趣点实体
    const poi1 = this.createSamplePOI([116.3974, 39.9093, 0]);
    layerManager.addEntityToLayer("pois", poi1, {
      type: "restaurant",
      name: "示例餐厅",
    });
  },

  /**
   * 创建示例建筑物
   */
  createSampleBuilding(position) {
    return {
      position: Cesium.Cartesian3.fromDegrees(...position),
      box: {
        dimensions: new Cesium.Cartesian3(50, 50, 100),
        material: Cesium.Color.BLUE.withAlpha(0.7),
      },
    };
  },

  /**
   * 创建示例道路
   */
  createSampleRoad(positions) {
    const cartesianPositions = positions.map((pos) =>
      Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2] || 0)
    );

    return {
      polyline: {
        positions: cartesianPositions,
        width: 5,
        material: Cesium.Color.YELLOW,
        clampToGround: true,
      },
    };
  },

  /**
   * 创建示例兴趣点
   */
  createSamplePOI(position) {
    return {
      position: Cesium.Cartesian3.fromDegrees(...position),
      billboard: {
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmZjAwMDAiLz4KPC9zdmc+",
        scale: 0.5,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    };
  },

  /**
   * 高级图层管理示例
   */
  advancedLayerManagement() {
    console.log("=== 高级图层管理示例 ===");

    // 1. 批量操作
    const layerNames = ["buildings", "roads", "pois"];

    // 批量隐藏图层
    layerManager.batchOperation(layerNames, "hide");

    // 批量设置透明度
    layerManager.batchOperation(layerNames, "opacity", 0.3);

    // 2. 按标签筛选
    const buildingLayers = layerManager.filterLayersByTags(["3D", "building"]);
    console.log("3D建筑图层:", buildingLayers);

    // 3. 图层配置导出/导入
    const config = layerManager.exportLayerConfig();
    console.log("图层配置:", config);

    // 模拟导入新配置
    const newConfig = {
      newLayer: {
        description: "新图层",
        tags: ["test"],
        visible: true,
        opacity: 1.0,
      },
    };

    const importResult = layerManager.importLayerConfig(newConfig);
    console.log("导入结果:", importResult);
  },

  /**
   * 图层管理工具示例
   */
  layerManagementTools() {
    console.log("=== 图层管理工具示例 ===");

    // 1. 图层搜索
    const searchResults = this.searchLayers("building");
    console.log("搜索结果:", searchResults);

    // 2. 图层分组
    this.groupLayersByType();

    // 3. 图层性能监控
    this.monitorLayerPerformance();
  },

  /**
   * 搜索图层
   */
  searchLayers(keyword) {
    const allLayers = layerManager.getAllLayers();
    return allLayers.filter(
      (layer) =>
        layer.name.toLowerCase().includes(keyword.toLowerCase()) ||
        layer.description.toLowerCase().includes(keyword.toLowerCase()) ||
        layer.tags.some((tag) =>
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  },

  /**
   * 按类型分组图层
   */
  groupLayersByType() {
    const allLayers = layerManager.getAllLayers();
    const grouped = allLayers.reduce((acc, layer) => {
      const type = layer.tags[0] || "default";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(layer);
      return acc;
    }, {});

    console.log("按类型分组的图层:", grouped);
    return grouped;
  },

  /**
   * 监控图层性能
   */
  monitorLayerPerformance() {
    const stats = layerManager.getStatistics();

    // 性能警告
    if (stats.totalEntities > 1000) {
      console.warn("实体数量过多，可能影响性能:", stats.totalEntities);
    }

    if (stats.visibleLayers > 10) {
      console.warn("可见图层过多，可能影响性能:", stats.visibleLayers);
    }

    console.log("图层性能统计:", stats);
    return stats;
  },

  /**
   * 清理示例
   */
  cleanup() {
    console.log("=== 清理示例 ===");

    // 获取所有图层名称
    const layerNames = layerManager.getLayerNames();

    // 批量移除所有图层
    layerManager.batchOperation(layerNames, "remove");

    console.log("示例清理完成");
  },
};

// 导出示例
export default layerManagerExample;
