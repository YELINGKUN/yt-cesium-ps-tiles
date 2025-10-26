/**
 * CesiumPlusManager使用示例
 *
 * 展示如何使用CesiumPlusManager管理多个CesiumPlus实例
 */

import CesiumPlusManager from "./CesiumPlusManager.js";

// 示例1: 创建多个CesiumPlus实例
function createMultipleInstances() {
  console.log("=== 创建多个CesiumPlus实例 ===");

  try {
    // 创建第一个实例
    const instance1 = CesiumPlusManager.getInstance("cesiumContainer1", {
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

    console.log("实例1创建成功:", instance1);

    // 创建第二个实例
    const instance2 = CesiumPlusManager.getInstance("cesiumContainer2", {
      animation: true,
      baseLayerPicker: true,
      fullscreenButton: true,
      geocoder: true,
      homeButton: true,
      infoBox: true,
      sceneModePicker: true,
      scene3DOnly: false,
      selectionIndicator: true,
      timeline: true,
      navigationHelpButton: true,
      shadows: false,
      shouldAnimate: false,
      baseLayer: false,
    });

    console.log("实例2创建成功:", instance2);

    // 创建第三个实例
    const instance3 = CesiumPlusManager.getInstance("cesiumContainer3", {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      scene3DOnly: true, // 3D模式
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      shadows: true,
      shouldAnimate: true,
      baseLayer: false,
    });

    console.log("实例3创建成功:", instance3);

    return { instance1, instance2, instance3 };
  } catch (error) {
    console.error("创建实例失败:", error.message);
    return null;
  }
}

// 示例2: 实例管理和切换
function instanceManagementExample() {
  console.log("=== 实例管理和切换示例 ===");

  // 获取所有实例信息
  const allInstances = CesiumPlusManager.getAllInstancesInfo();
  console.log("所有实例信息:", allInstances);

  // 获取统计信息
  const stats = CesiumPlusManager.getStats();
  console.log("管理器统计信息:", stats);

  // 获取当前实例
  const currentInstance = CesiumPlusManager.getCurrentInstance();
  const currentId = CesiumPlusManager.getCurrentInstanceId();
  console.log("当前实例ID:", currentId);
  console.log("当前实例:", currentInstance);

  // 切换到不同实例
  console.log("切换到实例2...");
  const switchResult = CesiumPlusManager.switchToInstance("cesiumContainer2");
  console.log("切换结果:", switchResult);

  // 验证切换结果
  const newCurrentId = CesiumPlusManager.getCurrentInstanceId();
  console.log("切换后当前实例ID:", newCurrentId);

  // 获取默认实例
  const defaultInstance = CesiumPlusManager.getDefaultInstance();
  console.log("默认实例:", defaultInstance);
}

// 示例3: 实例操作示例
function instanceOperationsExample() {
  console.log("=== 实例操作示例 ===");

  // 获取当前实例并执行操作
  const currentInstance = CesiumPlusManager.getCurrentInstance();
  if (currentInstance) {
    console.log("对当前实例执行操作...");

    // 添加点击事件
    currentInstance.getXyEvent();

    // 切换到2D模式
    currentInstance.switchTo2D();

    // 等待一段时间后切换到3D模式
    setTimeout(() => {
      currentInstance.switchTo3D();
      console.log("已切换到3D模式");
    }, 2000);
  }

  // 对特定实例执行操作
  const instance1 = CesiumPlusManager.getInstanceById("cesiumContainer1");
  if (instance1) {
    console.log("对实例1执行操作...");
    // 可以在这里添加特定的操作
  }
}

// 示例4: 事件监听示例
function eventListenerExample() {
  console.log("=== 事件监听示例 ===");

  // 添加实例切换监听器
  CesiumPlusManager.onInstanceSwitched((event) => {
    console.log("实例切换事件:", event.detail);
    console.log(
      `从实例 [${event.detail.fromId}] 切换到 [${event.detail.toId}]`
    );
  });

  // 模拟切换操作
  setTimeout(() => {
    CesiumPlusManager.switchToInstance("cesiumContainer1");
  }, 1000);

  setTimeout(() => {
    CesiumPlusManager.switchToInstance("cesiumContainer3");
  }, 3000);
}

// 示例5: 实例销毁示例
function instanceDestructionExample() {
  console.log("=== 实例销毁示例 ===");

  // 销毁特定实例
  console.log("销毁实例2...");
  const destroyResult = CesiumPlusManager.destroyInstance("cesiumContainer2");
  console.log("销毁结果:", destroyResult);

  // 查看剩余实例
  const remainingInstances = CesiumPlusManager.getAllInstanceIds();
  console.log("剩余实例:", remainingInstances);

  // 获取更新后的统计信息
  const updatedStats = CesiumPlusManager.getStats();
  console.log("更新后的统计信息:", updatedStats);
}

// 示例6: 完整的工作流程示例
function completeWorkflowExample() {
  console.log("=== 完整工作流程示例 ===");

  // 1. 创建多个实例
  console.log("1. 创建多个实例");
  const instances = createMultipleInstances();

  if (!instances) {
    console.error("实例创建失败，终止示例");
    return;
  }

  // 2. 管理实例
  console.log("2. 管理实例");
  instanceManagementExample();

  // 3. 执行操作
  console.log("3. 执行操作");
  instanceOperationsExample();

  // 4. 监听事件
  console.log("4. 监听事件");
  eventListenerExample();

  // 5. 清理资源
  setTimeout(() => {
    console.log("5. 清理资源");
    instanceDestructionExample();

    // 最终清理所有实例
    setTimeout(() => {
      console.log("最终清理所有实例");
      CesiumPlusManager.destroyAllInstances();

      const finalStats = CesiumPlusManager.getStats();
      console.log("最终统计信息:", finalStats);
    }, 2000);
  }, 5000);
}

// 示例7: 高级用法 - 动态创建和销毁
function advancedUsageExample() {
  console.log("=== 高级用法示例 ===");

  // 动态创建实例
  const createInstanceDynamically = (id, options = {}) => {
    try {
      const instance = CesiumPlusManager.getInstance(id, options);
      console.log(`动态创建实例 [${id}] 成功`);
      return instance;
    } catch (error) {
      console.error(`动态创建实例 [${id}] 失败:`, error.message);
      return null;
    }
  };

  // 批量创建实例
  const instanceConfigs = [
    { id: "dynamic1", options: { animation: false } },
    { id: "dynamic2", options: { animation: true } },
    { id: "dynamic3", options: { scene3DOnly: true } },
  ];

  instanceConfigs.forEach((config) => {
    createInstanceDynamically(config.id, config.options);
  });

  // 批量操作实例
  const allIds = CesiumPlusManager.getAllInstanceIds();
  console.log("所有实例ID:", allIds);

  // 批量切换
  allIds.forEach((id, index) => {
    setTimeout(() => {
      CesiumPlusManager.switchToInstance(id);
      console.log(`切换到实例 [${id}]`);
    }, index * 1000);
  });

  // 延迟清理
  setTimeout(() => {
    console.log("清理动态创建的实例");
    instanceConfigs.forEach((config) => {
      CesiumPlusManager.destroyInstance(config.id);
    });
  }, 10000);
}

// 导出示例函数
export {
  createMultipleInstances,
  instanceManagementExample,
  instanceOperationsExample,
  eventListenerExample,
  instanceDestructionExample,
  completeWorkflowExample,
  advancedUsageExample,
};

// 如果直接运行此文件，执行完整示例
if (typeof window !== "undefined") {
  // 在浏览器环境中，可以绑定到window对象供调试使用
  window.CesiumPlusManagerExamples = {
    createMultipleInstances,
    instanceManagementExample,
    instanceOperationsExample,
    eventListenerExample,
    instanceDestructionExample,
    completeWorkflowExample,
    advancedUsageExample,
  };

  console.log(
    "CesiumPlusManager示例已加载，可通过 window.CesiumPlusManagerExamples 访问示例函数"
  );
  console.log("可用的示例函数:", Object.keys(window.CesiumPlusManagerExamples));
}
