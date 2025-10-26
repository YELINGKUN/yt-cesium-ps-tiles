/**
 * CesiumPlusManager 快速测试
 *
 * 用于快速验证CesiumPlusManager的基本功能
 */

import CesiumPlusManager from "./CesiumPlusManager.js";

// 快速测试函数
function quickTest() {
  console.log("🚀 开始CesiumPlusManager快速测试");

  try {
    // 测试1: 创建实例
    console.log("📝 测试1: 创建多个实例");
    const instance1 = CesiumPlusManager.getInstance("testContainer1", {
      animation: false,
      baseLayerPicker: false,
    });
    console.log("✅ 实例1创建成功");

    const instance2 = CesiumPlusManager.getInstance("testContainer2", {
      animation: true,
      baseLayerPicker: true,
    });
    console.log("✅ 实例2创建成功");

    // 测试2: 获取实例
    console.log("📝 测试2: 获取实例");
    const currentInstance = CesiumPlusManager.getCurrentInstance();
    const currentId = CesiumPlusManager.getCurrentInstanceId();
    console.log("✅ 当前实例ID:", currentId);

    const specificInstance =
      CesiumPlusManager.getInstanceById("testContainer1");
    console.log("✅ 获取指定实例:", !!specificInstance);

    // 测试3: 实例切换
    console.log("📝 测试3: 实例切换");
    const switchResult = CesiumPlusManager.switchToInstance("testContainer1");
    console.log("✅ 切换结果:", switchResult);

    const newCurrentId = CesiumPlusManager.getCurrentInstanceId();
    console.log("✅ 切换后当前实例ID:", newCurrentId);

    // 测试4: 统计信息
    console.log("📝 测试4: 统计信息");
    const stats = CesiumPlusManager.getStats();
    console.log("✅ 统计信息:", stats);

    // 测试5: 实例列表
    console.log("📝 测试5: 实例列表");
    const allIds = CesiumPlusManager.getAllInstanceIds();
    const allInstances = CesiumPlusManager.getAllInstancesInfo();
    console.log("✅ 所有实例ID:", allIds);
    console.log("✅ 所有实例信息:", allInstances);

    // 测试6: 事件监听
    console.log("📝 测试6: 事件监听");
    CesiumPlusManager.onInstanceSwitched((event) => {
      console.log("✅ 收到切换事件:", event.detail);
    });

    // 触发切换事件
    CesiumPlusManager.switchToInstance("testContainer2");

    // 测试7: 实例销毁
    console.log("📝 测试7: 实例销毁");
    const destroyResult = CesiumPlusManager.destroyInstance("testContainer1");
    console.log("✅ 销毁结果:", destroyResult);

    const remainingStats = CesiumPlusManager.getStats();
    console.log("✅ 销毁后统计:", remainingStats);

    // 最终清理
    console.log("📝 最终清理");
    CesiumPlusManager.destroyAllInstances();
    const finalStats = CesiumPlusManager.getStats();
    console.log("✅ 最终统计:", finalStats);

    console.log("🎉 CesiumPlusManager快速测试完成！");
    return true;
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    return false;
  }
}

// 性能测试
function performanceTest() {
  console.log("⚡ 开始性能测试");

  const startTime = performance.now();

  try {
    // 创建多个实例
    for (let i = 0; i < 5; i++) {
      CesiumPlusManager.getInstance(`perfContainer${i}`, {
        animation: false,
        baseLayerPicker: false,
      });
    }

    // 切换操作
    for (let i = 0; i < 10; i++) {
      CesiumPlusManager.switchToInstance(`perfContainer${i % 5}`);
    }

    // 清理
    CesiumPlusManager.destroyAllInstances();

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`⚡ 性能测试完成，耗时: ${duration.toFixed(2)}ms`);
    return duration;
  } catch (error) {
    console.error("❌ 性能测试失败:", error.message);
    return -1;
  }
}

// 导出测试函数
export { quickTest, performanceTest };

// 如果直接运行此文件，执行测试
if (typeof window !== "undefined") {
  window.CesiumPlusManagerTest = {
    quickTest,
    performanceTest,
  };

  console.log(
    "CesiumPlusManager测试已加载，可通过 window.CesiumPlusManagerTest 访问测试函数"
  );
  console.log("运行测试: window.CesiumPlusManagerTest.quickTest()");
}
