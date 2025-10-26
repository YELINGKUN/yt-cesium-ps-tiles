import * as Cesium from "cesium";

/**
 * 图层管理器 - 用于管理CesiumPlus中的实体图层
 * 提供完整的图层创建、管理、控制功能
 */
export const layerManager = {
  // 图层集合
  layers: new Map(),

  // 默认图层配置
  defaultLayerConfig: {
    visible: true,
    opacity: 1.0,
    zIndex: 0,
    selectable: true,
    editable: false,
    description: "",
    tags: [],
    created: null,
    modified: null,
  },

  // 事件回调集合
  eventCallbacks: new Map(),

  /**
   * 创建新图层
   * @param {string} layerName - 图层名称
   * @param {Object} options - 图层配置选项
   * @returns {Object} 创建的图层对象
   */
  createLayer(layerName, options = {}) {
    // 验证图层名称
    if (!layerName || typeof layerName !== "string") {
      throw new Error("图层名称必须是非空字符串");
    }

    // 检查图层是否已存在
    if (this.layers.has(layerName)) {
      console.warn(`图层 "${layerName}" 已存在，将覆盖现有图层`);
    }

    // 合并默认配置
    const layerConfig = {
      ...this.defaultLayerConfig,
      ...options,
      name: layerName,
      entities: [],
      created: new Date(),
      modified: new Date(),
    };

    // 创建图层对象
    const layer = {
      ...layerConfig,
      // 图层状态
      isVisible: layerConfig.visible,
      isActive: true,

      // 统计信息
      entityCount: 0,

      // 图层方法
      addEntity: (entity) => this.addEntityToLayer(layerName, entity),
      removeEntity: (entity) => this.removeEntityFromLayer(layerName, entity),
      toggle: (visible) => this.toggleLayer(layerName, visible),
      clear: () => this.clearLayer(layerName),
      destroy: () => this.removeLayer(layerName),
    };

    this.layers.set(layerName, layer);

    // 触发图层创建事件
    this.triggerEvent("layerCreated", { layerName, layer });

    console.log(`图层 "${layerName}" 创建成功`);
    return layer;
  },

  /**
   * 添加实体到指定图层
   * @param {string} layerName - 图层名称
   * @param {Object} entity - Cesium实体对象
   * @param {Object} options - 实体选项
   * @returns {Object} 添加的实体
   */
  addEntityToLayer(layerName, entity, options = {}) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      throw new Error(`图层 "${layerName}" 不存在`);
    }

    if (!entity) {
      throw new Error("实体对象不能为空");
    }

    // 设置实体属性
    entity.layerName = layerName;
    entity.layerId = layer.id || this.generateLayerId();
    entity.layerOptions = { ...options };
    entity.show = layer.isVisible;

    // 添加到图层
    layer.entities.push(entity);
    layer.entityCount++;
    layer.modified = new Date();

    // 触发实体添加事件
    this.triggerEvent("entityAdded", { layerName, entity, layer });

    console.log(`实体已添加到图层 "${layerName}"`);
    return entity;
  },

  /**
   * 从图层中移除实体
   * @param {string} layerName - 图层名称
   * @param {Object} entity - 要移除的实体
   * @returns {boolean} 是否移除成功
   */
  removeEntityFromLayer(layerName, entity) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.warn(`图层 "${layerName}" 不存在`);
      return false;
    }

    const index = layer.entities.indexOf(entity);
    if (index === -1) {
      console.warn(`实体在图层 "${layerName}" 中不存在`);
      return false;
    }

    // 从图层中移除
    layer.entities.splice(index, 1);
    layer.entityCount--;
    layer.modified = new Date();

    // 从Cesium中移除实体
    if (this.viewer && this.viewer.entities) {
      this.viewer.entities.remove(entity);
    }

    // 触发实体移除事件
    this.triggerEvent("entityRemoved", { layerName, entity, layer });

    console.log(`实体已从图层 "${layerName}" 中移除`);
    return true;
  },

  /**
   * 显示/隐藏图层
   * @param {string} layerName - 图层名称
   * @param {boolean} visible - 是否可见
   * @returns {boolean} 操作是否成功
   */
  toggleLayer(layerName, visible) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.warn(`图层 "${layerName}" 不存在`);
      return false;
    }

    layer.isVisible = visible;
    layer.modified = new Date();

    // 批量设置实体可见性
    layer.entities.forEach((entity) => {
      if (entity.show !== undefined) {
        entity.show = visible;
      }
    });

    // 触发图层切换事件
    this.triggerEvent("layerToggled", { layerName, visible, layer });

    console.log(`图层 "${layerName}" ${visible ? "显示" : "隐藏"}`);
    return true;
  },

  /**
   * 设置图层透明度
   * @param {string} layerName - 图层名称
   * @param {number} opacity - 透明度 (0-1)
   * @returns {boolean} 操作是否成功
   */
  setLayerOpacity(layerName, opacity) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.warn(`图层 "${layerName}" 不存在`);
      return false;
    }

    if (opacity < 0 || opacity > 1) {
      throw new Error("透明度必须在0-1之间");
    }

    layer.opacity = opacity;
    layer.modified = new Date();

    // 应用透明度到实体
    layer.entities.forEach((entity) => {
      if (entity.point) {
        entity.point.color = entity.point.color.withAlpha(opacity);
      }
      if (entity.billboard) {
        entity.billboard.color = entity.billboard.color.withAlpha(opacity);
      }
      if (entity.polyline) {
        entity.polyline.material =
          entity.polyline.material.color.withAlpha(opacity);
      }
      if (entity.polygon) {
        entity.polygon.material =
          entity.polygon.material.color.withAlpha(opacity);
      }
    });

    // 触发透明度变化事件
    this.triggerEvent("layerOpacityChanged", { layerName, opacity, layer });

    console.log(`图层 "${layerName}" 透明度设置为 ${opacity}`);
    return true;
  },

  /**
   * 清空图层中的所有实体
   * @param {string} layerName - 图层名称
   * @returns {boolean} 操作是否成功
   */
  clearLayer(layerName) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.warn(`图层 "${layerName}" 不存在`);
      return false;
    }

    const entityCount = layer.entities.length;

    // 从Cesium中移除所有实体
    layer.entities.forEach((entity) => {
      if (this.viewer && this.viewer.entities) {
        this.viewer.entities.remove(entity);
      }
    });

    // 清空图层实体数组
    layer.entities = [];
    layer.entityCount = 0;
    layer.modified = new Date();

    // 触发图层清空事件
    this.triggerEvent("layerCleared", { layerName, entityCount, layer });

    console.log(`图层 "${layerName}" 已清空，移除了 ${entityCount} 个实体`);
    return true;
  },

  /**
   * 移除图层
   * @param {string} layerName - 图层名称
   * @returns {boolean} 操作是否成功
   */
  removeLayer(layerName) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.warn(`图层 "${layerName}" 不存在`);
      return false;
    }

    // 先清空图层
    this.clearLayer(layerName);

    // 从图层集合中移除
    this.layers.delete(layerName);

    // 触发图层移除事件
    this.triggerEvent("layerRemoved", { layerName });

    console.log(`图层 "${layerName}" 已移除`);
    return true;
  },

  /**
   * 获取图层信息
   * @param {string} layerName - 图层名称
   * @returns {Object|null} 图层对象
   */
  getLayer(layerName) {
    return this.layers.get(layerName) || null;
  },

  /**
   * 获取所有图层列表
   * @returns {Array} 图层列表
   */
  getAllLayers() {
    return Array.from(this.layers.values());
  },

  /**
   * 获取图层名称列表
   * @returns {Array} 图层名称数组
   */
  getLayerNames() {
    return Array.from(this.layers.keys());
  },

  /**
   * 检查图层是否存在
   * @param {string} layerName - 图层名称
   * @returns {boolean} 是否存在
   */
  hasLayer(layerName) {
    return this.layers.has(layerName);
  },

  /**
   * 批量操作图层
   * @param {Array} layerNames - 图层名称数组
   * @param {string} operation - 操作类型 ('show', 'hide', 'toggle', 'clear', 'remove')
   * @param {*} value - 操作值
   * @returns {Object} 操作结果
   */
  batchOperation(layerNames, operation, value = null) {
    const results = {
      success: [],
      failed: [],
      total: layerNames.length,
    };

    layerNames.forEach((layerName) => {
      try {
        let success = false;
        switch (operation) {
          case "show":
            success = this.toggleLayer(layerName, true);
            break;
          case "hide":
            success = this.toggleLayer(layerName, false);
            break;
          case "toggle":
            const layer = this.getLayer(layerName);
            success = layer
              ? this.toggleLayer(layerName, !layer.isVisible)
              : false;
            break;
          case "clear":
            success = this.clearLayer(layerName);
            break;
          case "remove":
            success = this.removeLayer(layerName);
            break;
          case "opacity":
            success = this.setLayerOpacity(layerName, value);
            break;
          default:
            throw new Error(`不支持的操作类型: ${operation}`);
        }

        if (success) {
          results.success.push(layerName);
        } else {
          results.failed.push(layerName);
        }
      } catch (error) {
        results.failed.push({ layerName, error: error.message });
      }
    });

    console.log(
      `批量操作完成: ${results.success.length} 成功, ${results.failed.length} 失败`
    );
    return results;
  },

  /**
   * 按标签筛选图层
   * @param {string|Array} tags - 标签或标签数组
   * @returns {Array} 匹配的图层
   */
  filterLayersByTags(tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    return this.getAllLayers().filter((layer) =>
      tagArray.some((tag) => layer.tags.includes(tag))
    );
  },

  /**
   * 获取图层统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const layers = this.getAllLayers();
    return {
      totalLayers: layers.length,
      visibleLayers: layers.filter((l) => l.isVisible).length,
      totalEntities: layers.reduce((sum, l) => sum + l.entityCount, 0),
      layersByType: layers.reduce((acc, layer) => {
        const type = layer.type || "default";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
    };
  },

  /**
   * 导出图层配置
   * @param {string} layerName - 图层名称，不指定则导出所有
   * @returns {Object} 图层配置
   */
  exportLayerConfig(layerName = null) {
    if (layerName) {
      const layer = this.getLayer(layerName);
      return layer ? this.sanitizeLayerForExport(layer) : null;
    }

    const config = {};
    this.layers.forEach((layer, name) => {
      config[name] = this.sanitizeLayerForExport(layer);
    });
    return config;
  },

  /**
   * 导入图层配置
   * @param {Object} config - 图层配置
   * @returns {Object} 导入结果
   */
  importLayerConfig(config) {
    const results = { success: [], failed: [] };

    Object.entries(config).forEach(([layerName, layerConfig]) => {
      try {
        this.createLayer(layerName, layerConfig);
        results.success.push(layerName);
      } catch (error) {
        results.failed.push({ layerName, error: error.message });
      }
    });

    console.log(
      `图层配置导入完成: ${results.success.length} 成功, ${results.failed.length} 失败`
    );
    return results;
  },

  /**
   * 事件监听
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(eventName, callback) {
    if (!this.eventCallbacks.has(eventName)) {
      this.eventCallbacks.set(eventName, []);
    }
    this.eventCallbacks.get(eventName).push(callback);
  },

  /**
   * 移除事件监听
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(eventName, callback) {
    const callbacks = this.eventCallbacks.get(eventName);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  },

  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {*} data - 事件数据
   */
  triggerEvent(eventName, data) {
    const callbacks = this.eventCallbacks.get(eventName);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`事件回调执行错误 (${eventName}):`, error);
        }
      });
    }
  },

  /**
   * 生成图层ID
   * @returns {string} 唯一ID
   */
  generateLayerId() {
    return (
      "layer_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  },

  /**
   * 清理图层数据用于导出
   * @param {Object} layer - 图层对象
   * @returns {Object} 清理后的图层配置
   */
  sanitizeLayerForExport(layer) {
    const { entities, ...config } = layer;
    return {
      ...config,
      entityCount: entities.length,
    };
  },

  /**
   * 初始化图层管理器
   * @param {Object} viewer - Cesium viewer实例
   */
  init(viewer) {
    this.viewer = viewer;
    console.log("图层管理器初始化完成");
  },

  /**
   * 销毁图层管理器
   */
  destroy() {
    // 清空所有图层
    this.layers.forEach((layer, layerName) => {
      this.removeLayer(layerName);
    });

    // 清空事件回调
    this.eventCallbacks.clear();

    // 清空viewer引用
    this.viewer = null;

    console.log("图层管理器已销毁");
  },
};
