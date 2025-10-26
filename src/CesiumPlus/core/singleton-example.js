/**
 * CesiumPlus单例模式使用示例
 *
 * 本文件展示了如何使用CesiumPlus的单例模式
 */

import CesiumPlus from "./index.js";

// 示例1: 创建CesiumPlus实例
function createCesiumInstance() {
  try {
    // 首次创建实例
    const cesiumInstance = CesiumPlus.getInstance("cesiumContainer", {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      scene3DOnly: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      shadows: true,
      shouldAnimate: true,
      baseLayer: false,
    });

    console.log("CesiumPlus实例创建成功:", cesiumInstance);
    return cesiumInstance;
  } catch (error) {
    console.error("创建CesiumPlus实例失败:", error.message);
  }
}

// 示例2: 获取已存在的实例
function getExistingInstance() {
  // 检查是否已有实例
  if (CesiumPlus.hasInstance()) {
    console.log("CesiumPlus实例已存在");
    // 获取现有实例（不需要提供参数）
    const existingInstance = CesiumPlus.getInstance();
    console.log("获取现有实例:", existingInstance);
    return existingInstance;
  } else {
    console.log("CesiumPlus实例不存在，需要先创建");
    return null;
  }
}

// 示例3: 销毁实例
function destroyInstance() {
  if (CesiumPlus.hasInstance()) {
    console.log("销毁CesiumPlus实例");
    CesiumPlus.destroyInstance();
    console.log("实例已销毁");
  } else {
    console.log("没有实例需要销毁");
  }
}

// 示例4: 完整的使用流程
function completeUsageExample() {
  console.log("=== CesiumPlus单例模式完整使用示例 ===");

  // 1. 创建实例
  console.log("1. 创建CesiumPlus实例");
  const instance1 = CesiumPlus.getInstance("cesiumContainer");

  // 2. 尝试再次创建（应该返回同一个实例）
  console.log("2. 尝试再次创建实例");
  const instance2 = CesiumPlus.getInstance("cesiumContainer");

  // 3. 验证是否为同一个实例
  console.log("3. 验证实例一致性:", instance1 === instance2);

  // 4. 检查实例状态
  console.log("4. 检查是否有实例:", CesiumPlus.hasInstance());

  // 5. 使用实例方法
  console.log("5. 使用实例方法");
  if (instance1) {
    // 添加点击事件监听
    instance1.getXyEvent();

    // 切换到2D模式
    instance1.switchTo2D();

    // 切换到3D模式
    instance1.switchTo3D();
  }

  // 6. 销毁实例
  console.log("6. 销毁实例");
  CesiumPlus.destroyInstance();

  // 7. 验证销毁结果
  console.log("7. 验证销毁结果:", CesiumPlus.hasInstance());
}

// 导出示例函数
export {
  createCesiumInstance,
  getExistingInstance,
  destroyInstance,
  completeUsageExample,
};

// 如果直接运行此文件，执行完整示例
if (typeof window !== "undefined") {
  // 在浏览器环境中，可以绑定到window对象供调试使用
  window.CesiumPlusExamples = {
    createCesiumInstance,
    getExistingInstance,
    destroyInstance,
    completeUsageExample,
  };

  console.log(
    "CesiumPlus单例模式示例已加载，可通过 window.CesiumPlusExamples 访问示例函数"
  );
}
