# CesiumPlusManager - 多实例管理器

CesiumPlusManager 是一个用于管理多个 CesiumPlus 实例的管理器类，通过不同的 ID 来区分和管理不同的 CesiumPlus 实例。

## 🚀 特性

- **多实例管理**: 支持创建和管理多个 CesiumPlus 实例
- **ID 区分**: 通过不同的 DOM 元素 ID 来区分不同实例
- **实例切换**: 支持在不同实例之间快速切换
- **生命周期管理**: 完整的实例创建、获取、销毁流程
- **事件监听**: 支持实例切换事件监听
- **统计信息**: 提供详细的实例统计和管理信息

## 📦 安装和导入

```javascript
import CesiumPlusManager from "./CesiumPlusManager.js";
```

## 🔧 基本用法

### 1. 创建多个实例

```javascript
// 创建第一个实例
const instance1 = CesiumPlusManager.getInstance("cesiumContainer1", {
  animation: false,
  baseLayerPicker: false,
  // ... 其他配置
});

// 创建第二个实例
const instance2 = CesiumPlusManager.getInstance("cesiumContainer2", {
  animation: true,
  baseLayerPicker: true,
  // ... 其他配置
});

// 创建第三个实例
const instance3 = CesiumPlusManager.getInstance("cesiumContainer3", {
  scene3DOnly: true,
  // ... 其他配置
});
```

### 2. 获取和管理实例

```javascript
// 获取当前活跃的实例
const currentInstance = CesiumPlusManager.getCurrentInstance();

// 获取指定ID的实例
const specificInstance = CesiumPlusManager.getInstanceById("cesiumContainer1");

// 获取当前实例ID
const currentId = CesiumPlusManager.getCurrentInstanceId();

// 检查实例是否存在
const hasInstance = CesiumPlusManager.hasInstance("cesiumContainer1");
```

### 3. 实例切换

```javascript
// 切换到指定实例
const switchResult = CesiumPlusManager.switchToInstance("cesiumContainer2");

// 获取所有实例ID
const allIds = CesiumPlusManager.getAllInstanceIds();

// 获取所有实例信息
const allInstances = CesiumPlusManager.getAllInstancesInfo();
```

### 4. 实例销毁

```javascript
// 销毁指定实例
const destroyResult = CesiumPlusManager.destroyInstance("cesiumContainer1");

// 销毁所有实例
CesiumPlusManager.destroyAllInstances();
```

## 📊 API 参考

### 核心方法

| 方法                                     | 参数                                               | 返回值           | 描述               |
| ---------------------------------------- | -------------------------------------------------- | ---------------- | ------------------ |
| `getInstance(id, options, setAsCurrent)` | id: string, options: Object, setAsCurrent: boolean | CesiumPlus       | 创建或获取实例     |
| `getInstanceById(id)`                    | id: string                                         | CesiumPlus\|null | 获取指定 ID 的实例 |
| `getCurrentInstance()`                   | -                                                  | CesiumPlus\|null | 获取当前活跃实例   |
| `getCurrentInstanceId()`                 | -                                                  | string\|null     | 获取当前实例 ID    |
| `switchToInstance(id)`                   | id: string                                         | boolean          | 切换到指定实例     |
| `hasInstance(id)`                        | id: string                                         | boolean          | 检查实例是否存在   |

### 管理方法

| 方法                    | 参数       | 返回值        | 描述             |
| ----------------------- | ---------- | ------------- | ---------------- |
| `getAllInstanceIds()`   | -          | Array<string> | 获取所有实例 ID  |
| `getAllInstancesInfo()` | -          | Array<Object> | 获取所有实例信息 |
| `destroyInstance(id)`   | id: string | boolean       | 销毁指定实例     |
| `destroyAllInstances()` | -          | void          | 销毁所有实例     |
| `getStats()`            | -          | Object        | 获取统计信息     |

### 默认实例管理

| 方法                     | 参数       | 返回值           | 描述         |
| ------------------------ | ---------- | ---------------- | ------------ |
| `setDefaultInstance(id)` | id: string | boolean          | 设置默认实例 |
| `getDefaultInstance()`   | -          | CesiumPlus\|null | 获取默认实例 |

### 事件监听

| 方法                            | 参数               | 返回值 | 描述           |
| ------------------------------- | ------------------ | ------ | -------------- |
| `onInstanceSwitched(callback)`  | callback: Function | void   | 添加切换监听器 |
| `offInstanceSwitched(callback)` | callback: Function | void   | 移除切换监听器 |

## 🎯 使用场景

### 场景 1: 多视图应用

```javascript
// 主视图
const mainView = CesiumPlusManager.getInstance("mainCesium", {
  animation: true,
  timeline: true,
});

// 预览视图
const previewView = CesiumPlusManager.getInstance("previewCesium", {
  animation: false,
  timeline: false,
});

// 切换视图
CesiumPlusManager.switchToInstance("mainCesium");
```

### 场景 2: 不同配置的实例

```javascript
// 2D模式实例
const view2D = CesiumPlusManager.getInstance("cesium2D", {
  scene3DOnly: false,
  sceneModePicker: true,
});

// 3D模式实例
const view3D = CesiumPlusManager.getInstance("cesium3D", {
  scene3DOnly: true,
  shadows: true,
});

// 根据需求切换
if (need3D) {
  CesiumPlusManager.switchToInstance("cesium3D");
} else {
  CesiumPlusManager.switchToInstance("cesium2D");
}
```

### 场景 3: 动态实例管理

```javascript
// 动态创建实例
const createDynamicInstance = (id, config) => {
  return CesiumPlusManager.getInstance(id, config);
};

// 批量操作
const instanceIds = ["view1", "view2", "view3"];
instanceIds.forEach((id) => {
  createDynamicInstance(id, { animation: false });
});

// 批量切换
instanceIds.forEach((id, index) => {
  setTimeout(() => {
    CesiumPlusManager.switchToInstance(id);
  }, index * 1000);
});
```

## 🔍 事件监听

```javascript
// 监听实例切换事件
CesiumPlusManager.onInstanceSwitched((event) => {
  console.log("实例切换:", event.detail);
  console.log(`从 ${event.detail.fromId} 切换到 ${event.detail.toId}`);
});

// 移除监听器
const callback = (event) => {
  /* ... */
};
CesiumPlusManager.onInstanceSwitched(callback);
CesiumPlusManager.offInstanceSwitched(callback);
```

## 📈 统计信息

```javascript
// 获取管理器统计信息
const stats = CesiumPlusManager.getStats();
console.log("统计信息:", stats);
/*
{
  totalInstances: 3,
  currentInstanceId: 'cesiumContainer2',
  defaultInstanceId: 'cesiumContainer1',
  instanceIds: ['cesiumContainer1', 'cesiumContainer2', 'cesiumContainer3'],
  hasCurrentInstance: true,
  hasDefaultInstance: true
}
*/
```

## ⚠️ 注意事项

1. **DOM 元素**: 确保每个实例对应的 DOM 元素 ID 是唯一的
2. **资源管理**: 及时销毁不需要的实例以避免内存泄漏
3. **实例切换**: 切换实例时会触发相应的事件，可以监听这些事件
4. **默认实例**: 第一个创建的实例会自动成为默认实例
5. **错误处理**: 所有方法都包含错误处理，建议检查返回值

## 🚀 快速开始

```javascript
import CesiumPlusManager from "./CesiumPlusManager.js";

// 1. 创建实例
const instance1 = CesiumPlusManager.getInstance("container1");
const instance2 = CesiumPlusManager.getInstance("container2");

// 2. 切换实例
CesiumPlusManager.switchToInstance("container1");

// 3. 执行操作
const current = CesiumPlusManager.getCurrentInstance();
current.switchTo2D();

// 4. 清理资源
CesiumPlusManager.destroyAllInstances();
```

## 📝 示例

查看 `manager-example.js` 文件获取完整的使用示例。
