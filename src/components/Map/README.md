# MapContainer 组件使用说明

## 概述

`MapContainer` 是一个干净的地图容器组件，专门负责 Cesium 地图的初始化和管理。它采用了职责分离的设计理念，只专注于地图的核心功能，其他功能通过独立组件实现。

## 设计理念

### 职责分离

- **MapContainer**: 只负责地图初始化和提供地图实例
- **其他组件**: 通过获取地图实例来实现具体功能（图层管理、实体操作等）

### 优势

1. **单一职责**: 每个组件职责明确，便于维护
2. **高度复用**: 地图实例可以被多个组件共享使用
3. **灵活扩展**: 新功能通过独立组件实现，不影响核心容器
4. **易于测试**: 各组件独立，便于单元测试

## 基本用法

```vue
<template>
  <div class="app">
    <!-- 地图容器 -->
    <MapContainer
      ref="mapContainer"
      container-id="myMap"
      :viewer-options="viewerOptions"
      :initial-view="initialView"
      @map-ready="onMapReady"
      @map-error="onMapError"
    />

    <!-- 其他功能组件 -->
    <LayerManager :map-instance="mapInstance" />
    <EntityManager :map-instance="mapInstance" />
  </div>
</template>

<script>
import MapContainer from "./MapContainer.vue";
import LayerManager from "./LayerManager.vue";
import EntityManager from "./EntityManager.vue";

export default {
  components: {
    MapContainer,
    LayerManager,
    EntityManager,
  },
  data() {
    return {
      mapInstance: null,
      viewerOptions: {
        animation: false,
        baseLayerPicker: false,
        // ... 其他配置
      },
      initialView: {
        lng: 116.3974,
        lat: 39.9093,
        height: 10000,
        pitchRadiu: -30,
      },
    };
  },
  methods: {
    onMapReady(data) {
      this.mapInstance = data.ffCesium;
      console.log("地图已就绪:", data);
    },
    onMapError(error) {
      console.error("地图初始化失败:", error);
    },
  },
};
</script>
```

## API 参考

### Props

| 属性名                 | 类型    | 默认值           | 说明                      |
| ---------------------- | ------- | ---------------- | ------------------------- |
| `containerId`          | String  | `'mapContainer'` | Cesium 容器的 DOM 元素 ID |
| `viewerOptions`        | Object  | `{}`             | Cesium Viewer 配置选项    |
| `initialView`          | Object  | `{}`             | 初始视图配置              |
| `autoAddDefaultLayers` | Boolean | `true`           | 是否自动添加默认图层      |
| `autoAddTerrain`       | Boolean | `true`           | 是否自动添加地形          |

### Events

| 事件名            | 参数                         | 说明                 |
| ----------------- | ---------------------------- | -------------------- |
| `map-ready`       | `{ffCesium, viewer, cesium}` | 地图初始化完成       |
| `map-error`       | `Error`                      | 地图初始化失败       |
| `model-click`     | `model`                      | 点击模型时触发       |
| `empty-click`     | -                            | 点击空白区域时触发   |
| `camera-move-end` | `position`                   | 相机移动结束时触发   |
| `fly-to`          | `options`                    | 飞行到指定位置时触发 |
| `view-changed`    | `options`                    | 视图改变时触发       |
| `view-reset`      | `options`                    | 视图重置时触发       |

### Methods

| 方法名             | 参数     | 返回值          | 说明                    |
| ------------------ | -------- | --------------- | ----------------------- |
| `getFFCesium()`    | -        | `FFCesium`      | 获取 FFCesium 实例      |
| `getViewer()`      | -        | `Cesium.Viewer` | 获取 Cesium Viewer 实例 |
| `getCesium()`      | -        | `Object`        | 获取 Cesium 对象        |
| `isMapReady()`     | -        | `Boolean`       | 检查地图是否已初始化    |
| `flyTo(options)`   | `Object` | -               | 飞行到指定位置          |
| `setView(options)` | `Object` | -               | 设置视图                |
| `resetView()`      | -        | -               | 重置视图到初始位置      |

## 在其他组件中使用地图实例

```vue
<template>
  <div class="layer-manager">
    <button @click="addLayer" :disabled="!mapInstance">添加图层</button>
    <button @click="removeLayer" :disabled="!mapInstance">移除图层</button>
  </div>
</template>

<script>
export default {
  name: "LayerManager",
  props: {
    mapInstance: {
      type: Object,
      default: null,
    },
  },
  methods: {
    addLayer() {
      if (this.mapInstance) {
        // 使用地图实例添加图层
        const layer = this.mapInstance.addTdtVecLayer();
        console.log("图层已添加:", layer);
      }
    },
    removeLayer() {
      if (this.mapInstance) {
        // 使用地图实例移除图层
        this.mapInstance.removeMapLayer(layer);
        console.log("图层已移除");
      }
    },
  },
};
</script>
```

## 最佳实践

### 1. 组件通信

- 使用 `map-ready` 事件获取地图实例
- 通过 props 将地图实例传递给子组件
- 使用事件进行组件间通信

### 2. 错误处理

- 监听 `map-error` 事件处理初始化错误
- 在操作地图前检查 `isMapReady()` 状态
- 提供重试机制

### 3. 性能优化

- 避免在模板中频繁调用地图方法
- 使用 `v-if` 控制功能组件的渲染
- 合理使用事件监听器

### 4. 扩展功能

- 创建独立的功能组件（LayerManager、EntityManager 等）
- 通过组合模式实现复杂功能
- 保持组件的单一职责

## 示例项目结构

```
src/components/
├── Map/
│   ├── MapContainer.vue      # 地图容器组件
│   ├── MapDemo.vue          # 使用示例
│   └── README.md            # 使用说明
├── LayerManager/
│   └── LayerManager.vue     # 图层管理组件
├── EntityManager/
│   └── EntityManager.vue    # 实体管理组件
└── MapControls/
    └── MapControls.vue     # 地图控制组件
```

这种架构设计使得每个组件都有明确的职责，便于维护和扩展。
