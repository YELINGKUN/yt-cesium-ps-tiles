/**
 * CesiumPlusManager - CesiumPlus实例管理器
 *
 * 用于管理多个CesiumPlus实例，通过ID进行区分和管理
 * 支持创建、获取、切换、销毁等操作
 */
import CesiumPlus from "./index.js";

class CesiumPlusManager {
  static _instances = new Map(); // 存储所有CesiumPlus实例
  static _currentInstanceId = null; // 当前活跃的实例ID
  static _defaultInstanceId = null; // 默认实例ID

  /**
   * 创建或获取CesiumPlus实例
   * @param {string} id - DOM元素ID
   * @param {Object} options - CesiumPlus配置选项
   * @param {boolean} setAsCurrent - 是否设置为当前活跃实例
   * @returns {CesiumPlus} CesiumPlus实例
   */
  static getInstance(id, options = {}, setAsCurrent = true) {
    if (!id) {
      throw new Error("CesiumPlusManager: 必须提供DOM元素ID");
    }

    // 如果实例已存在，直接返回
    if (this._instances.has(id)) {
      console.log(`CesiumPlusManager: 获取已存在的实例 [${id}]`);
      if (setAsCurrent) {
        this._currentInstanceId = id;
      }
      return this._instances.get(id);
    }

    // 创建新实例
    try {
      console.log(`CesiumPlusManager: 创建新实例 [${id}]`);

      // 临时修改CesiumPlus的单例行为，允许创建多个实例
      const originalGetInstance = CesiumPlus.getInstance;
      CesiumPlus.getInstance = function (instanceId, instanceOptions) {
        // 直接创建新实例，不检查单例限制
        return new CesiumPlus(instanceId, instanceOptions);
      };

      const instance = CesiumPlus.getInstance(id, options);

      // 恢复原始方法
      CesiumPlus.getInstance = originalGetInstance;

      // 存储实例
      this._instances.set(id, instance);

      // 设置当前实例
      if (setAsCurrent) {
        this._currentInstanceId = id;
      }

      // 设置默认实例（第一个创建的实例）
      if (!this._defaultInstanceId) {
        this._defaultInstanceId = id;
      }

      console.log(`CesiumPlusManager: 实例 [${id}] 创建成功`);
      return instance;
    } catch (error) {
      console.error(`CesiumPlusManager: 创建实例 [${id}] 失败:`, error.message);
      throw error;
    }
  }

  /**
   * 获取指定ID的实例
   * @param {string} id - 实例ID
   * @returns {CesiumPlus|null} CesiumPlus实例或null
   */
  static getInstanceById(id) {
    if (!id) {
      return this.getCurrentInstance();
    }
    return this._instances.get(id) || null;
  }

  /**
   * 获取当前活跃的实例
   * @returns {CesiumPlus|null} 当前活跃的CesiumPlus实例
   */
  static getCurrentInstance() {
    if (
      this._currentInstanceId &&
      this._instances.has(this._currentInstanceId)
    ) {
      return this._instances.get(this._currentInstanceId);
    }
    return null;
  }

  /**
   * 获取当前活跃实例的ID
   * @returns {string|null} 当前实例ID
   */
  static getCurrentInstanceId() {
    return this._currentInstanceId;
  }

  /**
   * 切换到指定实例
   * @param {string} id - 要切换到的实例ID
   * @returns {boolean} 切换是否成功
   */
  static switchToInstance(id) {
    if (!this._instances.has(id)) {
      console.warn(`CesiumPlusManager: 实例 [${id}] 不存在`);
      return false;
    }

    const previousId = this._currentInstanceId;
    this._currentInstanceId = id;

    console.log(`CesiumPlusManager: 从实例 [${previousId}] 切换到 [${id}]`);

    // 触发切换事件
    this._triggerSwitchEvent(previousId, id);

    return true;
  }

  /**
   * 检查实例是否存在
   * @param {string} id - 实例ID
   * @returns {boolean} 实例是否存在
   */
  static hasInstance(id) {
    return this._instances.has(id);
  }

  /**
   * 获取所有实例ID列表
   * @returns {Array<string>} 所有实例ID数组
   */
  static getAllInstanceIds() {
    return Array.from(this._instances.keys());
  }

  /**
   * 获取所有实例信息
   * @returns {Array<Object>} 实例信息数组
   */
  static getAllInstancesInfo() {
    const instances = [];
    this._instances.forEach((instance, id) => {
      instances.push({
        id: id,
        isCurrent: id === this._currentInstanceId,
        isDefault: id === this._defaultInstanceId,
        cesiumId: instance.cesiumID,
        viewer: instance.viewer,
      });
    });
    return instances;
  }

  /**
   * 销毁指定实例
   * @param {string} id - 要销毁的实例ID
   * @returns {boolean} 销毁是否成功
   */
  static destroyInstance(id) {
    if (!this._instances.has(id)) {
      console.warn(`CesiumPlusManager: 实例 [${id}] 不存在`);
      return false;
    }

    try {
      const instance = this._instances.get(id);

      // 销毁Cesium viewer
      if (instance.viewer) {
        instance.viewer.destroy();
      }

      // 从Map中移除
      this._instances.delete(id);

      // 如果销毁的是当前实例，需要重新设置当前实例
      if (this._currentInstanceId === id) {
        this._currentInstanceId =
          this._instances.size > 0
            ? Array.from(this._instances.keys())[0]
            : null;
      }

      // 如果销毁的是默认实例，重新设置默认实例
      if (this._defaultInstanceId === id) {
        this._defaultInstanceId =
          this._instances.size > 0
            ? Array.from(this._instances.keys())[0]
            : null;
      }

      console.log(`CesiumPlusManager: 实例 [${id}] 销毁成功`);
      return true;
    } catch (error) {
      console.error(`CesiumPlusManager: 销毁实例 [${id}] 失败:`, error.message);
      return false;
    }
  }

  /**
   * 销毁所有实例
   */
  static destroyAllInstances() {
    console.log("CesiumPlusManager: 开始销毁所有实例");

    const instanceIds = Array.from(this._instances.keys());
    instanceIds.forEach((id) => {
      this.destroyInstance(id);
    });

    this._currentInstanceId = null;
    this._defaultInstanceId = null;

    console.log("CesiumPlusManager: 所有实例销毁完成");
  }

  /**
   * 设置默认实例
   * @param {string} id - 实例ID
   * @returns {boolean} 设置是否成功
   */
  static setDefaultInstance(id) {
    if (!this._instances.has(id)) {
      console.warn(`CesiumPlusManager: 实例 [${id}] 不存在`);
      return false;
    }

    this._defaultInstanceId = id;
    console.log(`CesiumPlusManager: 设置实例 [${id}] 为默认实例`);
    return true;
  }

  /**
   * 获取默认实例
   * @returns {CesiumPlus|null} 默认实例
   */
  static getDefaultInstance() {
    if (
      this._defaultInstanceId &&
      this._instances.has(this._defaultInstanceId)
    ) {
      return this._instances.get(this._defaultInstanceId);
    }
    return null;
  }

  /**
   * 获取实例统计信息
   * @returns {Object} 统计信息
   */
  static getStats() {
    return {
      totalInstances: this._instances.size,
      currentInstanceId: this._currentInstanceId,
      defaultInstanceId: this._defaultInstanceId,
      instanceIds: this.getAllInstanceIds(),
      hasCurrentInstance: !!this._currentInstanceId,
      hasDefaultInstance: !!this._defaultInstanceId,
    };
  }

  /**
   * 触发实例切换事件
   * @private
   * @param {string} fromId - 源实例ID
   * @param {string} toId - 目标实例ID
   */
  static _triggerSwitchEvent(fromId, toId) {
    // 可以在这里添加事件监听器逻辑
    if (typeof window !== "undefined" && window.dispatchEvent) {
      const event = new CustomEvent("cesiumPlusInstanceSwitched", {
        detail: {
          fromId: fromId,
          toId: toId,
          timestamp: new Date().toISOString(),
        },
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * 添加实例切换监听器
   * @param {Function} callback - 回调函数
   */
  static onInstanceSwitched(callback) {
    if (typeof window !== "undefined") {
      window.addEventListener("cesiumPlusInstanceSwitched", callback);
    }
  }

  /**
   * 移除实例切换监听器
   * @param {Function} callback - 回调函数
   */
  static offInstanceSwitched(callback) {
    if (typeof window !== "undefined") {
      window.removeEventListener("cesiumPlusInstanceSwitched", callback);
    }
  }
}

export default CesiumPlusManager;
