<template>
    <div class="test-container">
        <div class="header">
            <h1>CesiumPlusManager 测试组件</h1>
            <p>用于测试多实例管理器的功能</p>
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
            <div class="section">
                <h3>实例管理</h3>
                <div class="button-group">
                    <button @click="createInstances" :disabled="loading">
                        {{ loading ? '创建中...' : '创建多个实例' }}
                    </button>
                    <button @click="switchToInstance1" :disabled="!hasInstance1">
                        切换到实例1
                    </button>
                    <button @click="switchToInstance2" :disabled="!hasInstance2">
                        切换到实例2
                    </button>
                    <button @click="switchToInstance3" :disabled="!hasInstance3">
                        切换到实例3
                    </button>
                </div>
            </div>

            <div class="section">
                <h3>实例操作</h3>
                <div class="button-group">
                    <button @click="executeOperations" :disabled="!currentInstance">
                        执行操作
                    </button>
                    <button @click="testEventListeners" :disabled="instances.length === 0">
                        测试事件监听
                    </button>
                    <button @click="destroyInstance" :disabled="instances.length === 0">
                        销毁实例2
                    </button>
                </div>
            </div>

            <div class="section">
                <h3>测试功能</h3>
                <div class="button-group">
                    <button @click="runQuickTest" :disabled="testing">
                        {{ testing ? '测试中...' : '快速测试' }}
                    </button>
                    <button @click="runPerformanceTest" :disabled="testing">
                        {{ testing ? '测试中...' : '性能测试' }}
                    </button>
                    <button @click="runCompleteWorkflow" :disabled="testing">
                        {{ testing ? '运行中...' : '完整工作流程' }}
                    </button>
                    <button @click="clearAll" class="danger">
                        清理所有实例
                    </button>
                </div>

                <!-- 图层管理测试按钮 -->
                <div class="button-group">
                    <h3>图层管理测试</h3>
                    <button @click="initLayerManager" :disabled="testing">
                        初始化图层管理器
                    </button>
                    <button @click="createTestLayers" :disabled="testing">
                        创建测试图层
                    </button>
                    <button @click="addTestEntities" :disabled="testing">
                        添加测试实体
                    </button>
                    <button @click="testLayerVisibility" :disabled="testing">
                        测试图层可见性
                    </button>
                    <button @click="testLayerOpacity" :disabled="testing">
                        测试图层透明度
                    </button>
                    <button @click="testLayerStatistics" :disabled="testing">
                        图层统计信息
                    </button>
                    <button @click="testBatchOperations" :disabled="testing">
                        批量操作测试
                    </button>
                    <button @click="testLayerExportImport" :disabled="testing">
                        导出/导入测试
                    </button>
                    <button @click="runLayerManagerTest" :disabled="testing" class="primary">
                        {{ testing ? '测试中...' : '完整图层测试' }}
                    </button>
                    <button @click="clearTestLayers" class="danger">
                        清理测试图层
                    </button>
                </div>

                <!-- CesiumPlusManager实例管理测试按钮 -->
                <div class="button-group">
                    <h3>实例管理测试</h3>
                    <button @click="getCesiumPlusInstancesInfo" :disabled="testing">
                        获取实例信息
                    </button>
                    <button @click="getCurrentCesiumPlusInstance" :disabled="testing">
                        获取当前实例
                    </button>
                    <button @click="testCesiumPlusManagerInstances" :disabled="testing">
                        测试实例管理
                    </button>
                    <button @click="() => getCesiumPlusInstance('testInstance', {}, true)" :disabled="testing">
                        创建测试实例
                    </button>
                    <button @click="() => switchCesiumPlusInstance('cesiumContainer1')" :disabled="testing">
                        切换到实例1
                    </button>
                    <button @click="() => destroyCesiumPlusInstance('testInstance')" :disabled="testing" class="danger">
                        销毁测试实例
                    </button>
                </div>

                <!-- 地球初始化状态检查按钮 -->
                <div class="button-group">
                    <h3>地球初始化状态</h3>
                    <button @click="checkInitializationStatus" :disabled="testing">
                        检查初始化状态
                    </button>
                    <button @click="forceReinitialize" :disabled="testing">
                        强制重新初始化
                    </button>
                    <button @click="waitForEarthReady" :disabled="testing">
                        等待地球就绪
                    </button>
                    <button @click="autoInitializeLayerManager" :disabled="testing">
                        自动初始化图层管理器
                    </button>
                </div>
            </div>
        </div>




        <!-- Vue3地球容器组件 -->
        <div class="earth-container-section">
            <h3>Vue3地球容器组件 - 图层管理测试</h3>

            <!-- 初始化状态显示 -->
            <div class="initialization-status">
                <h4>初始化状态</h4>
                <div class="status-indicators">
                    <div class="status-item" :class="{ 'status-ok': initializationStatus.earthContainer }">
                        <span class="status-icon">{{ initializationStatus.earthContainer ? '✓' : '✗' }}</span>
                        <span class="status-label">地球容器DOM</span>
                    </div>
                    <div class="status-item" :class="{ 'status-ok': initializationStatus.earthInstance }">
                        <span class="status-icon">{{ initializationStatus.earthInstance ? '✓' : '✗' }}</span>
                        <span class="status-label">地球实例</span>
                    </div>
                    <div class="status-item" :class="{ 'status-ok': initializationStatus.earthViewer }">
                        <span class="status-icon">{{ initializationStatus.earthViewer ? '✓' : '✗' }}</span>
                        <span class="status-label">地球Viewer</span>
                    </div>
                    <div class="status-item" :class="{ 'status-ok': initializationStatus.layerManager }">
                        <span class="status-icon">{{ initializationStatus.layerManager ? '✓' : '✗' }}</span>
                        <span class="status-label">图层管理器</span>
                    </div>
                    <div class="status-item" :class="{ 'status-ok': initializationStatus.cesiumPlusInstance }">
                        <span class="status-icon">{{ initializationStatus.cesiumPlusInstance ? '✓' : '✗' }}</span>
                        <span class="status-label">CesiumPlus实例</span>
                    </div>
                    <div class="status-item overall-status"
                        :class="{ 'status-ok': initializationStatus.isFullyInitialized }">
                        <span class="status-icon">{{ initializationStatus.isFullyInitialized ? '✓' : '✗' }}</span>
                        <span class="status-label">完全初始化</span>
                    </div>
                </div>
            </div>

            <div class="earth-content">
                <div class="earth-wrapper">
                    <EarthContainer container-id="vueEarthContainer" :viewer-options="earthViewerOptions"
                        :initial-view="earthInitialView" @earth-ready="onEarthReady" @model-click="onModelClick"
                        @empty-click="onEmptyClick" @log="onEarthLog" />
                </div>

                <!-- 图层列表 -->
                <div class="layer-panel">
                    <h4>图层列表</h4>
                    <div class="layer-list">
                        <div v-for="layer in layerList" :key="layer.name" class="layer-item"
                            :class="{ active: selectedLayer === layer.name }" @click="selectLayer(layer.name)">
                            <div class="layer-header">
                                <div class="layer-info">
                                    <span class="layer-name">{{ layer.name }}</span>
                                    <span class="layer-type">{{ layer.type }}</span>
                                </div>
                                <div class="layer-controls">
                                    <label class="layer-toggle">
                                        <input type="checkbox" :checked="layer.isVisible"
                                            @change="toggleLayer(layer.name, $event.target.checked)" @click.stop>
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <div class="layer-opacity">
                                        <input type="range" min="0" max="1" step="0.1" :value="layer.opacity"
                                            @input="setLayerOpacity(layer.name, parseFloat($event.target.value))"
                                            @click.stop>
                                        <span class="opacity-value">{{ Math.round(layer.opacity * 100) }}%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="layer-details">
                                <div class="layer-stats">
                                    <span>实体数: {{ layer.entityCount }}</span>
                                    <span>标签: {{ layer.tags.join(', ') }}</span>
                                </div>
                                <div class="layer-description">{{ layer.description }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="layer-actions">
                        <button @click="refreshLayerList" :disabled="!layerManager" class="refresh-btn">
                            刷新列表
                        </button>
                        <button @click="focusOnEntities" :disabled="!layerManager" class="focus-btn">
                            定位到实体
                        </button>
                    </div>
                </div>
            </div>

            <div class="earth-test-controls">
                <button @click="runEarthLayerTests" :disabled="!earthInstance" class="test-button">
                    运行图层管理测试
                </button>
                <button @click="clearEarthLayers" :disabled="!earthInstance" class="clear-button">
                    清除所有图层
                </button>
            </div>
        </div>

        <!-- 日志面板 -->
        <div class="log-panel">
            <h3>操作日志</h3>
            <div class="log-content" ref="logContent">
                <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
                    <span class="log-time">{{ log.time }}</span>
                    <span class="log-message">{{ log.message }}</span>
                </div>
            </div>
            <button @click="clearLogs" class="clear-logs">清空日志</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as Cesium from "cesium";
import CesiumPlusManager from '../CesiumPlus/core/CesiumPlusManager.js';
import {
    createMultipleInstances,
    instanceManagementExample,
    instanceOperationsExample,
    eventListenerExample,
    instanceDestructionExample,
    completeWorkflowExample,
    advancedUsageExample
} from '../CesiumPlus/core/manager-example.js';
import { quickTest, performanceTest } from '../CesiumPlus/core/manager-test.js';
import EarthContainer from './EarthContainer.vue';

// 响应式数据
const loading = ref(false);
const testing = ref(false);
const instances = ref([]);
const currentInstanceId = ref(null);
const stats = reactive({
    totalInstances: 0,
    currentInstanceId: null,
    defaultInstanceId: null,
    instanceIds: [],
    hasCurrentInstance: false,
    hasDefaultInstance: false
});
const logs = ref([]);
const eventListenerCallback = ref(null);

// Vue3地球容器相关数据
const earthViewerOptions = reactive({
    animation: false,
    baseLayerPicker: false,
    baseLayer: false,
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
});

const earthInitialView = reactive({
    lng: 129.85897571573392,
    lat: 46.62706812460703,
    height: 8000,
    pitchRadiu: -40,
});

const earthInstance = ref(null);

// 图层管理测试相关
const layerManager = ref(null);
const testLayers = ref([]);
const layerTestResults = ref([]);
const layerList = ref([]);
const selectedLayer = ref(null);

// 初始化状态管理
const initializationStatus = reactive({
    earthContainer: false,
    earthInstance: false,
    earthViewer: false,
    layerManager: false,
    cesiumPlusInstance: false,
    isFullyInitialized: false
});

// DOM引用
const logContent = ref(null);

// 计算属性
const hasInstance1 = computed(() => {
    return stats.instanceIds.includes('cesiumContainer1');
});

const hasInstance2 = computed(() => {
    return stats.instanceIds.includes('cesiumContainer2');
});

const hasInstance3 = computed(() => {
    return stats.instanceIds.includes('cesiumContainer3');
});

const currentInstance = computed(() => {
    return CesiumPlusManager.getCurrentInstance();
});

// 生命周期钩子
onMounted(async () => {
    addLog('组件已挂载，开始初始化地球和CesiumPlusManager', 'info');

    try {
        // 1. 更新状态
        updateStatus();

        // 2. 等待DOM完全渲染
        await nextTick();

        // 3. 初始化地球容器
        await initializeEarthContainer();

        // 4. 等待地球容器准备就绪
        await waitForEarthReady();

        // 5. 自动初始化图层管理器
        await autoInitializeLayerManager();

        // 6. 最终状态检查
        checkEarthInitializationStatus();

        addLog('地球和CesiumPlusManager初始化完成', 'success');

    } catch (error) {
        addLog(`初始化过程中出错: ${error.message}`, 'error');
        // 即使出错也要检查状态
        checkEarthInitializationStatus();
    }
});

onBeforeUnmount(() => {
    // 清理事件监听器
    if (eventListenerCallback.value) {
        CesiumPlusManager.offInstanceSwitched(eventListenerCallback.value);
    }

    // 清理所有实例
    CesiumPlusManager.destroyAllInstances();
    addLog('组件卸载，已清理所有实例', 'info');
});

// 工具函数
// 添加日志
const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    logs.value.push({ time, message, type });

    // 自动滚动到底部
    nextTick(() => {
        if (logContent.value) {
            logContent.value.scrollTop = logContent.value.scrollHeight;
        }
    });
};

// 清空日志
const clearLogs = () => {
    logs.value = [];
};

// 更新状态
const updateStatus = () => {
    Object.assign(stats, CesiumPlusManager.getStats());
    currentInstanceId.value = CesiumPlusManager.getCurrentInstanceId();
    instances.value = CesiumPlusManager.getAllInstancesInfo();
};

// 实例管理方法
// 创建多个实例
const createInstances = async () => {
    loading.value = true;
    addLog('开始创建多个 CesiumPlus 实例...', 'info');

    try {
        const result = createMultipleInstances();
        if (result) {
            addLog('成功创建多个实例', 'success');
            updateStatus();
        } else {
            addLog('创建实例失败', 'error');
        }
    } catch (error) {
        addLog(`创建实例出错: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

// 切换到实例1
const switchToInstance1 = () => {
    const result = CesiumPlusManager.switchToInstance('cesiumContainer1');
    addLog(`切换到实例1: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
    updateStatus();
};

// 切换到实例2
const switchToInstance2 = () => {
    const result = CesiumPlusManager.switchToInstance('cesiumContainer2');
    addLog(`切换到实例2: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
    updateStatus();
};

// 切换到实例3
const switchToInstance3 = () => {
    const result = CesiumPlusManager.switchToInstance('cesiumContainer3');
    addLog(`切换到实例3: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
    updateStatus();
};

// 执行实例操作
const executeOperations = () => {
    addLog('开始执行实例操作...', 'info');
    try {
        instanceOperationsExample();
        addLog('实例操作执行完成', 'success');
    } catch (error) {
        addLog(`实例操作出错: ${error.message}`, 'error');
    }
};

// 测试事件监听
const testEventListeners = () => {
    addLog('开始测试事件监听...', 'info');

    // 移除之前的监听器
    if (eventListenerCallback.value) {
        CesiumPlusManager.offInstanceSwitched(eventListenerCallback.value);
    }

    // 添加新的监听器
    eventListenerCallback.value = (event) => {
        addLog(`收到切换事件: 从 ${event.detail.fromId} 到 ${event.detail.toId}`, 'event');
    };

    CesiumPlusManager.onInstanceSwitched(eventListenerCallback.value);

    // 执行事件监听示例
    try {
        eventListenerExample();
        addLog('事件监听测试完成', 'success');
    } catch (error) {
        addLog(`事件监听测试出错: ${error.message}`, 'error');
    }
};

// 销毁实例
const destroyInstance = () => {
    addLog('开始销毁实例2...', 'info');
    try {
        const result = CesiumPlusManager.destroyInstance('cesiumContainer2');
        addLog(`销毁实例2: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
        updateStatus();
    } catch (error) {
        addLog(`销毁实例出错: ${error.message}`, 'error');
    }
};

// 测试方法
// 运行快速测试
const runQuickTest = async () => {
    testing.value = true;
    addLog('开始快速测试...', 'info');

    try {
        const result = quickTest();
        addLog(`快速测试完成: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
        updateStatus();
    } catch (error) {
        addLog(`快速测试出错: ${error.message}`, 'error');
    } finally {
        testing.value = false;
    }
};

// 运行性能测试
const runPerformanceTest = async () => {
    testing.value = true;
    addLog('开始性能测试...', 'info');

    try {
        const duration = performanceTest();
        if (duration > 0) {
            addLog(`性能测试完成，耗时: ${duration.toFixed(2)}ms`, 'success');
        } else {
            addLog('性能测试失败', 'error');
        }
        updateStatus();
    } catch (error) {
        addLog(`性能测试出错: ${error.message}`, 'error');
    } finally {
        testing.value = false;
    }
};

// 运行完整工作流程
const runCompleteWorkflow = async () => {
    testing.value = true;
    addLog('开始完整工作流程测试...', 'info');

    try {
        completeWorkflowExample();
        addLog('完整工作流程测试完成', 'success');
        updateStatus();
    } catch (error) {
        addLog(`完整工作流程测试出错: ${error.message}`, 'error');
    } finally {
        testing.value = false;
    }
};

// 清理所有实例
const clearAll = () => {
    addLog('开始清理所有实例...', 'info');
    try {
        CesiumPlusManager.destroyAllInstances();
        addLog('所有实例已清理', 'success');
        updateStatus();
    } catch (error) {
        addLog(`清理实例出错: ${error.message}`, 'error');
    }
};

// Vue3地球容器事件处理
const onEarthReady = (ffCesiumInstance) => {
    earthInstance.value = ffCesiumInstance;
    addLog('Vue3地球容器初始化完成', 'success');

    // 更新初始化状态
    checkEarthInitializationStatus();

    // 如果组件已经挂载完成，尝试自动初始化图层管理器
    if (document.body && document.body.offsetParent !== null) {
        nextTick(() => {
            autoInitializeLayerManager().then(success => {
                if (success) {
                    addLog('地球容器就绪后，图层管理器自动初始化完成', 'success');
                }
            });
        });
    }
};

const onModelClick = (model) => {
    addLog(`Vue3地球容器 - 点击模型: ${model.id || '未知'}`, 'event');
};

const onEmptyClick = () => {
    addLog('Vue3地球容器 - 点击空白区域', 'event');
};

const onEarthLog = (logData) => {
    addLog(`[Vue3地球] ${logData.message}`, logData.type);
};

// ========== 地球初始化管理方法 ==========

/**
 * 初始化地球容器
 * @returns {Promise<boolean>} 初始化是否成功
 */
const initializeEarthContainer = async () => {
    try {
        addLog('开始初始化地球容器', 'info');

        // 检查地球容器DOM是否存在
        const earthContainer = document.getElementById('vueEarthContainer');
        if (!earthContainer) {
            addLog('地球容器DOM元素不存在，等待渲染...', 'warning');

            // 等待DOM渲染
            let retryCount = 0;
            const maxRetries = 10;

            while (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 100));
                const container = document.getElementById('vueEarthContainer');
                if (container) {
                    addLog('地球容器DOM元素已找到', 'success');
                    break;
                }
                retryCount++;
            }

            if (retryCount >= maxRetries) {
                throw new Error('地球容器DOM元素未找到');
            }
        }

        addLog('地球容器DOM准备就绪', 'success');
        checkEarthInitializationStatus();
        return true;

    } catch (error) {
        addLog(`初始化地球容器失败: ${error.message}`, 'error');
        return false;
    }
};

/**
 * 等待地球容器准备就绪
 * @returns {Promise<boolean>} 是否准备就绪
 */
const waitForEarthReady = async () => {
    try {
        addLog('等待地球容器准备就绪...', 'info');

        // 如果已经有地球实例，直接返回
        if (earthInstance.value && earthInstance.value.viewer) {
            addLog('地球实例已存在', 'success');
            return true;
        }

        // 等待地球实例创建
        let waitTime = 0;
        const maxWaitTime = 10000; // 最多等待10秒
        const checkInterval = 100;

        while (waitTime < maxWaitTime) {
            if (earthInstance.value && earthInstance.value.viewer) {
                addLog(`地球容器准备就绪 (等待时间: ${waitTime}ms)`, 'success');
                checkEarthInitializationStatus();
                return true;
            }

            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waitTime += checkInterval;
        }

        throw new Error('地球容器初始化超时');

    } catch (error) {
        addLog(`等待地球容器准备就绪失败: ${error.message}`, 'error');
        return false;
    }
};

/**
 * 自动初始化图层管理器
 * @returns {Promise<boolean>} 初始化是否成功
 */
const autoInitializeLayerManager = async () => {
    try {
        addLog('开始自动初始化图层管理器', 'info');

        // 确保地球实例存在
        if (!earthInstance.value || !earthInstance.value.viewer) {
            addLog('地球实例未准备就绪，无法初始化图层管理器', 'error');
            return false;
        }

        // 使用统一的实例获取方法
        const instanceResult = getCesiumPlusInstance();

        if (!instanceResult.success) {
            addLog(`获取CesiumPlus实例失败: ${instanceResult.error}`, 'error');
            return false;
        }

        const cesiumPlusInstance = instanceResult.instance;

        // 验证实例状态
        const validation = validateCesiumPlusInstance(cesiumPlusInstance);
        if (!validation.isValid) {
            addLog(`CesiumPlus实例验证失败: ${validation.error}`, 'error');
            addLog(`验证详情: ${validation.details.join(', ')}`, 'error');
            return false;
        }

        // 设置图层管理器
        layerManager.value = cesiumPlusInstance;

        // 初始化图层管理器
        layerManager.value.init(earthInstance.value.viewer);
        addLog(`图层管理器自动初始化成功 (实例: ${instanceResult.containerId})`, 'success');

        // 刷新图层列表
        refreshLayerList();

        // 更新初始化状态
        checkEarthInitializationStatus();

        return true;

    } catch (error) {
        addLog(`自动初始化图层管理器失败: ${error.message}`, 'error');
        return false;
    }
};

/**
 * 检查地球初始化状态
 * @returns {Object} 初始化状态信息
 */
const checkEarthInitializationStatus = () => {
    const status = {
        earthContainer: !!document.getElementById('vueEarthContainer'),
        earthInstance: !!earthInstance.value,
        earthViewer: !!(earthInstance.value && earthInstance.value.viewer),
        layerManager: !!layerManager.value,
        cesiumPlusInstance: !!CesiumPlusManager.getCurrentInstance(),
        isFullyInitialized: false
    };

    status.isFullyInitialized = status.earthContainer &&
        status.earthInstance &&
        status.earthViewer &&
        status.layerManager &&
        status.cesiumPlusInstance;

    // 更新组件状态
    Object.assign(initializationStatus, status);

    return status;
};

// ========== CesiumPlusManager 实例管理方法 ==========

/**
 * 获取或创建CesiumPlusManager实例的统一方法
 * @param {string} containerId - 容器ID，可选，默认使用当前地球容器
 * @param {Object} options - 实例配置选项
 * @param {boolean} forceCreate - 是否强制创建新实例
 * @returns {Object} 包含实例和状态信息的对象
 */
const getCesiumPlusInstance = (containerId = null, options = {}, forceCreate = false) => {
    try {
        // 确定容器ID
        const targetContainerId = containerId || earthInstance.value?.containerId || 'vueEarthContainer';

        addLog(`尝试获取CesiumPlus实例: ${targetContainerId}`, 'info');

        // 检查是否已存在实例
        if (!forceCreate && CesiumPlusManager.hasInstance(targetContainerId)) {
            const existingInstance = CesiumPlusManager.getInstanceById(targetContainerId);
            addLog(`找到已存在的实例: ${targetContainerId}`, 'success');
            return {
                instance: existingInstance,
                isNew: false,
                containerId: targetContainerId,
                success: true
            };
        }

        // 创建新实例
        const defaultOptions = {
            animation: false,
            baseLayerPicker: false,
            baseLayer: false,
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
            ...options
        };

        const newInstance = CesiumPlusManager.getInstance(targetContainerId, defaultOptions, true);
        addLog(`成功创建新实例: ${targetContainerId}`, 'success');

        return {
            instance: newInstance,
            isNew: true,
            containerId: targetContainerId,
            success: true
        };

    } catch (error) {
        addLog(`获取CesiumPlus实例失败: ${error.message}`, 'error');
        return {
            instance: null,
            isNew: false,
            containerId: containerId,
            success: false,
            error: error.message
        };
    }
};

/**
 * 获取当前活跃的CesiumPlus实例
 * @returns {Object} 包含实例和状态信息的对象
 */
const getCurrentCesiumPlusInstance = () => {
    try {
        const currentInstance = CesiumPlusManager.getCurrentInstance();
        const currentId = CesiumPlusManager.getCurrentInstanceId();

        if (currentInstance) {
            addLog(`获取当前实例成功: ${currentId}`, 'success');
            return {
                instance: currentInstance,
                instanceId: currentId,
                success: true
            };
        } else {
            addLog('当前没有活跃的CesiumPlus实例', 'warning');
            return {
                instance: null,
                instanceId: null,
                success: false,
                error: 'No active instance'
            };
        }
    } catch (error) {
        addLog(`获取当前实例失败: ${error.message}`, 'error');
        return {
            instance: null,
            instanceId: null,
            success: false,
            error: error.message
        };
    }
};



/**
 * 验证CesiumPlus实例状态
 * @param {Object} instance - CesiumPlus实例
 * @returns {Object} 验证结果
 */
const validateCesiumPlusInstance = (instance) => {
    if (!instance) {
        return {
            isValid: false,
            error: '实例为空',
            details: []
        };
    }

    const details = [];
    let isValid = true;

    // 检查基本属性
    if (!instance.viewer) {
        details.push('缺少viewer属性');
        isValid = false;
    }

    if (!instance.Cesium) {
        details.push('缺少Cesium属性');
        isValid = false;
    }

    // 检查viewer状态
    if (instance.viewer) {
        if (!instance.viewer.scene) {
            details.push('viewer缺少scene属性');
            isValid = false;
        }

        if (!instance.viewer.camera) {
            details.push('viewer缺少camera属性');
            isValid = false;
        }

        if (!instance.viewer.entities) {
            details.push('viewer缺少entities属性');
            isValid = false;
        }
    }

    return {
        isValid,
        error: isValid ? null : '实例验证失败',
        details
    };
};

// ========== 图层管理测试方法 ==========

// 初始化图层管理器
const initLayerManager = () => {
    try {
        if (!earthInstance.value || !earthInstance.value.viewer) {
            addLog('地球实例未初始化，无法初始化图层管理器', 'error');
            return false;
        }

        // 使用统一的实例获取方法
        const instanceResult = getCesiumPlusInstance();

        if (!instanceResult.success) {
            addLog(`获取CesiumPlus实例失败: ${instanceResult.error}`, 'error');
            return false;
        }

        const cesiumPlusInstance = instanceResult.instance;

        // 验证实例状态
        const validation = validateCesiumPlusInstance(cesiumPlusInstance);
        if (!validation.isValid) {
            addLog(`CesiumPlus实例验证失败: ${validation.error}`, 'error');
            addLog(`验证详情: ${validation.details.join(', ')}`, 'error');
            return false;
        }

        // 设置图层管理器
        layerManager.value = cesiumPlusInstance;

        // 初始化图层管理器
        layerManager.value.init(earthInstance.value.viewer);
        addLog(`图层管理器初始化成功 (实例: ${instanceResult.containerId})`, 'success');

        return true;
    } catch (error) {
        addLog(`初始化图层管理器出错: ${error.message}`, 'error');
        return false;
    }
};

// 创建测试图层
const createTestLayers = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        // 创建不同类型的测试图层
        const layers = [
            {
                name: '北京点图层',
                options: {
                    type: 'point',
                    description: '北京位置的点实体图层',
                    tags: ['test', 'point', 'beijing'],
                    visible: true,
                    opacity: 1.0
                }
            },
            {
                name: '上海点图层',
                options: {
                    type: 'point',
                    description: '上海位置的点实体图层',
                    tags: ['test', 'point', 'shanghai'],
                    visible: true,
                    opacity: 1.0
                }
            },
            {
                name: '连接线图层',
                options: {
                    type: 'polyline',
                    description: '连接北京和上海的线图层',
                    tags: ['test', 'line', 'connection'],
                    visible: true,
                    opacity: 0.8
                }
            },
            {
                name: '区域面图层',
                options: {
                    type: 'polygon',
                    description: '测试区域面图层',
                    tags: ['test', 'polygon', 'area'],
                    visible: true,
                    opacity: 0.6
                }
            }
        ];

        layers.forEach(layerConfig => {
            const layer = layerManager.value.createLayer(layerConfig.name, layerConfig.options);
            testLayers.value.push(layer);
            addLog(`创建图层: ${layerConfig.name}`, 'success');
        });

        addLog(`成功创建 ${layers.length} 个测试图层`, 'success');
    } catch (error) {
        addLog(`创建测试图层出错: ${error.message}`, 'error');
    }
};

// 添加测试实体到图层
const addTestEntities = () => {
    if (!layerManager.value || !earthInstance.value) {
        addLog('图层管理器或地球实例未初始化', 'error');
        return;
    }

    try {
        const viewer = earthInstance.value.viewer;

        // 添加北京点到北京点图层
        const beijingLayer = layerManager.value.getLayer('北京点图层');
        if (beijingLayer) {
            const beijingPoint = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 0),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: '北京',
                    font: '14pt sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -50),
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE
                }
            });

            layerManager.value.addEntityToLayer('北京点图层', beijingPoint);
            addLog('添加北京点实体', 'success');
        }

        // 添加上海点到上海点图层
        const shanghaiLayer = layerManager.value.getLayer('上海点图层');
        if (shanghaiLayer) {
            const shanghaiPoint = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(121.5, 31.2, 0),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: '上海',
                    font: '14pt sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -50),
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE
                }
            });

            layerManager.value.addEntityToLayer('上海点图层', shanghaiPoint);
            addLog('添加上海点实体', 'success');
        }

        // 添加连接线到连接线图层
        const lineLayer = layerManager.value.getLayer('连接线图层');
        if (lineLayer) {
            const polyline = viewer.entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        116.4, 39.9,
                        121.5, 31.2
                    ]),
                    width: 4,
                    material: Cesium.Color.CYAN,
                    clampToGround: true
                }
            });

            layerManager.value.addEntityToLayer('连接线图层', polyline);
            addLog('添加连接线实体', 'success');
        }

        // 添加区域面到区域面图层
        const polygonLayer = layerManager.value.getLayer('区域面图层');
        if (polygonLayer) {
            const polygon = viewer.entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray([
                        115.0, 38.0,
                        123.0, 38.0,
                        123.0, 42.0,
                        115.0, 42.0
                    ]),
                    material: Cesium.Color.BLUE.withAlpha(0.3),
                    outline: true,
                    outlineColor: Cesium.Color.BLUE
                }
            });

            layerManager.value.addEntityToLayer('区域面图层', polygon);
            addLog('添加区域面实体', 'success');
        }

        // 自动定位到实体区域
        focusOnEntities();

    } catch (error) {
        addLog(`添加测试实体出错: ${error.message}`, 'error');
    }
};

// 自动定位到实体区域
const focusOnEntities = () => {
    if (!earthInstance.value || !earthInstance.value.viewer) {
        return;
    }

    try {
        const viewer = earthInstance.value.viewer;

        // 计算包含所有实体的边界
        const positions = [
            Cesium.Cartesian3.fromDegrees(116.4, 39.9), // 北京
            Cesium.Cartesian3.fromDegrees(121.5, 31.2), // 上海
            Cesium.Cartesian3.fromDegrees(115.0, 38.0), // 区域面左下
            Cesium.Cartesian3.fromDegrees(123.0, 42.0)  // 区域面右上
        ];

        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);

        // 飞行到实体区域
        viewer.camera.flyToBoundingSphere(boundingSphere, {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), boundingSphere.radius * 2)
        });

        addLog('自动定位到实体区域', 'success');
    } catch (error) {
        addLog(`自动定位出错: ${error.message}`, 'error');
    }
};

// 测试图层显示/隐藏
const testLayerVisibility = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        const layerNames = layerManager.value.getLayerNames();

        // 隐藏所有图层
        layerNames.forEach(layerName => {
            layerManager.value.toggleLayer(layerName, false);
        });
        addLog('隐藏所有图层', 'info');

        // 延迟显示图层
        setTimeout(() => {
            layerNames.forEach((layerName, index) => {
                setTimeout(() => {
                    layerManager.value.toggleLayer(layerName, true);
                    addLog(`显示图层: ${layerName}`, 'info');
                }, index * 1000);
            });
        }, 2000);

    } catch (error) {
        addLog(`测试图层可见性出错: ${error.message}`, 'error');
    }
};

// 测试图层透明度
const testLayerOpacity = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        const layerNames = layerManager.value.getLayerNames();
        const opacities = [0.2, 0.4, 0.6, 0.8, 1.0];

        layerNames.forEach((layerName, index) => {
            const opacity = opacities[index % opacities.length];
            layerManager.value.setLayerOpacity(layerName, opacity);
            addLog(`设置图层 ${layerName} 透明度为 ${opacity}`, 'info');
        });

    } catch (error) {
        addLog(`测试图层透明度出错: ${error.message}`, 'error');
    }
};

// 测试图层事件监听
const testLayerEvents = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        // 监听图层事件
        layerManager.value.on('layerCreated', (data) => {
            addLog(`[事件] 图层创建: ${data.layerName}`, 'event');
        });

        layerManager.value.on('entityAdded', (data) => {
            addLog(`[事件] 实体添加: ${data.layerName}`, 'event');
        });

        layerManager.value.on('layerToggled', (data) => {
            addLog(`[事件] 图层切换: ${data.layerName} -> ${data.visible ? '显示' : '隐藏'}`, 'event');
        });

        layerManager.value.on('layerOpacityChanged', (data) => {
            addLog(`[事件] 透明度变化: ${data.layerName} -> ${data.opacity}`, 'event');
        });

        addLog('图层事件监听器已设置', 'success');

    } catch (error) {
        addLog(`设置图层事件监听出错: ${error.message}`, 'error');
    }
};

// 清理测试图层
const clearTestLayers = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        const layerNames = layerManager.value.getLayerNames();

        layerNames.forEach(layerName => {
            layerManager.value.removeLayer(layerName);
            addLog(`移除图层: ${layerName}`, 'info');
        });

        testLayers.value = [];
        addLog('所有测试图层已清理', 'success');

    } catch (error) {
        addLog(`清理测试图层出错: ${error.message}`, 'error');
    }
};

// 运行完整的图层管理测试
const runLayerManagerTest = () => {
    addLog('开始图层管理器完整测试', 'info');

    // 初始化图层管理器
    if (!initLayerManager()) {
        return;
    }

    // 等待初始化完成
    setTimeout(() => {
        // 创建测试图层
        createTestLayers();

        // 等待图层创建完成
        setTimeout(() => {
            // 刷新图层列表
            refreshLayerList();

            // 添加测试实体
            addTestEntities();

            // 等待实体添加完成
            setTimeout(() => {
                // 再次刷新图层列表以显示实体数量
                refreshLayerList();

                addLog('图层管理器测试完成', 'success');
            }, 2000);
        }, 1000);
    }, 1000);
};

// ========== 图层列表管理方法 ==========

// 刷新图层列表
const refreshLayerList = () => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        const allLayers = layerManager.value.getAllLayers();
        layerList.value = allLayers.map(layer => ({
            name: layer.name,
            type: layer.type,
            description: layer.description || '无描述',
            tags: layer.tags || [],
            isVisible: layer.isVisible,
            opacity: layer.opacity,
            entityCount: layer.entityCount || 0,
            createdAt: layer.createdAt
        }));

        addLog(`刷新图层列表，共 ${layerList.value.length} 个图层`, 'success');
    } catch (error) {
        addLog(`刷新图层列表出错: ${error.message}`, 'error');
    }
};

// 选择图层
const selectLayer = (layerName) => {
    selectedLayer.value = layerName;
    addLog(`选择图层: ${layerName}`, 'info');
};

// 切换图层显示/隐藏
const toggleLayer = (layerName, visible) => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        layerManager.value.toggleLayer(layerName, visible);

        // 更新图层列表中的状态
        const layer = layerList.value.find(l => l.name === layerName);
        if (layer) {
            layer.isVisible = visible;
        }

        addLog(`${visible ? '显示' : '隐藏'}图层: ${layerName}`, 'success');
    } catch (error) {
        addLog(`切换图层显示状态出错: ${error.message}`, 'error');
    }
};

// 设置图层透明度
const setLayerOpacity = (layerName, opacity) => {
    if (!layerManager.value) {
        addLog('图层管理器未初始化', 'error');
        return;
    }

    try {
        layerManager.value.setLayerOpacity(layerName, opacity);

        // 更新图层列表中的状态
        const layer = layerList.value.find(l => l.name === layerName);
        if (layer) {
            layer.opacity = opacity;
        }

        addLog(`设置图层 ${layerName} 透明度为 ${Math.round(opacity * 100)}%`, 'info');
    } catch (error) {
        addLog(`设置图层透明度出错: ${error.message}`, 'error');
    }
};

// 运行地球图层测试
const runEarthLayerTests = () => {
    runLayerManagerTest();
};

// 清除地球图层
const clearEarthLayers = () => {
    clearTestLayers();
    layerList.value = [];
    selectedLayer.value = null;
};

// ========== 实例管理辅助方法 ==========

/**
 * 获取所有CesiumPlus实例信息
 * @returns {Object} 实例统计信息
 */
const getCesiumPlusInstancesInfo = () => {
    try {
        const stats = CesiumPlusManager.getStats();
        const allInstances = CesiumPlusManager.getAllInstancesInfo();
        const currentInstance = CesiumPlusManager.getCurrentInstance();

        addLog('获取CesiumPlus实例信息', 'info');
        addLog(`总实例数: ${stats.totalInstances}`, 'info');
        addLog(`当前实例ID: ${stats.currentInstanceId || '无'}`, 'info');
        addLog(`默认实例ID: ${stats.defaultInstanceId || '无'}`, 'info');

        allInstances.forEach(instance => {
            addLog(`实例 [${instance.id}]: ${instance.isCurrent ? '当前' : ''} ${instance.isDefault ? '默认' : ''}`, 'info');
        });

        return {
            stats,
            allInstances,
            currentInstance,
            success: true
        };
    } catch (error) {
        addLog(`获取实例信息失败: ${error.message}`, 'error');
        return {
            stats: null,
            allInstances: [],
            currentInstance: null,
            success: false,
            error: error.message
        };
    }
};

/**
 * 切换到指定的CesiumPlus实例
 * @param {string} instanceId - 实例ID
 * @returns {boolean} 切换是否成功
 */
const switchCesiumPlusInstance = (instanceId) => {
    try {
        if (!CesiumPlusManager.hasInstance(instanceId)) {
            addLog(`实例不存在: ${instanceId}`, 'error');
            return false;
        }

        const result = CesiumPlusManager.switchToInstance(instanceId);
        if (result) {
            addLog(`成功切换到实例: ${instanceId}`, 'success');
            updateStatus();
            return true;
        } else {
            addLog(`切换实例失败: ${instanceId}`, 'error');
            return false;
        }
    } catch (error) {
        addLog(`切换实例出错: ${error.message}`, 'error');
        return false;
    }
};

/**
 * 销毁指定的CesiumPlus实例
 * @param {string} instanceId - 实例ID
 * @returns {boolean} 销毁是否成功
 */
const destroyCesiumPlusInstance = (instanceId) => {
    try {
        if (!CesiumPlusManager.hasInstance(instanceId)) {
            addLog(`实例不存在: ${instanceId}`, 'warning');
            return false;
        }

        const result = CesiumPlusManager.destroyInstance(instanceId);
        if (result) {
            addLog(`成功销毁实例: ${instanceId}`, 'success');
            updateStatus();

            // 如果销毁的是当前图层管理器实例，清空图层管理器
            if (layerManager.value && layerManager.value.cesiumID === instanceId) {
                layerManager.value = null;
                layerList.value = [];
                selectedLayer.value = null;
                addLog('图层管理器已清空', 'info');
            }

            return true;
        } else {
            addLog(`销毁实例失败: ${instanceId}`, 'error');
            return false;
        }
    } catch (error) {
        addLog(`销毁实例出错: ${error.message}`, 'error');
        return false;
    }
};

/**
 * 测试CesiumPlusManager实例管理功能
 */
const testCesiumPlusManagerInstances = () => {
    addLog('开始测试CesiumPlusManager实例管理功能', 'info');

    try {
        // 1. 获取实例信息
        const instancesInfo = getCesiumPlusInstancesInfo();
        if (!instancesInfo.success) {
            addLog('获取实例信息失败', 'error');
            return;
        }

        // 2. 测试创建新实例
        const testContainerId = 'testContainer_' + Date.now();
        const createResult = getCesiumPlusInstance(testContainerId, {
            animation: true,
            baseLayerPicker: true
        }, true);

        if (createResult.success) {
            addLog(`测试实例创建成功: ${createResult.containerId}`, 'success');

            // 3. 测试实例切换
            setTimeout(() => {
                const switchResult = switchCesiumPlusInstance(createResult.containerId);
                if (switchResult) {
                    addLog('测试实例切换成功', 'success');

                    // 4. 测试实例销毁
                    setTimeout(() => {
                        const destroyResult = destroyCesiumPlusInstance(createResult.containerId);
                        if (destroyResult) {
                            addLog('测试实例销毁成功', 'success');
                            addLog('CesiumPlusManager实例管理功能测试完成', 'success');
                        }
                    }, 2000);
                }
            }, 2000);
        } else {
            addLog(`测试实例创建失败: ${createResult.error}`, 'error');
        }

    } catch (error) {
        addLog(`测试CesiumPlusManager实例管理功能出错: ${error.message}`, 'error');
    }
};

// ========== 地球初始化状态管理方法 ==========

/**
 * 检查初始化状态
 */
const checkInitializationStatus = () => {
    addLog('检查地球初始化状态', 'info');

    const status = checkEarthInitializationStatus();

    addLog(`地球容器DOM: ${status.earthContainer ? '✓' : '✗'}`, status.earthContainer ? 'success' : 'error');
    addLog(`地球实例: ${status.earthInstance ? '✓' : '✗'}`, status.earthInstance ? 'success' : 'error');
    addLog(`地球Viewer: ${status.earthViewer ? '✓' : '✗'}`, status.earthViewer ? 'success' : 'error');
    addLog(`图层管理器: ${status.layerManager ? '✓' : '✗'}`, status.layerManager ? 'success' : 'error');
    addLog(`CesiumPlus实例: ${status.cesiumPlusInstance ? '✓' : '✗'}`, status.cesiumPlusInstance ? 'success' : 'error');
    addLog(`完全初始化: ${status.isFullyInitialized ? '✓' : '✗'}`, status.isFullyInitialized ? 'success' : 'error');

    if (!status.isFullyInitialized) {
        addLog('初始化未完成，建议使用"强制重新初始化"', 'warning');
    }
};

/**
 * 强制重新初始化
 */
const forceReinitialize = async () => {
    addLog('开始强制重新初始化', 'info');

    try {
        // 1. 清理现有状态
        layerManager.value = null;
        layerList.value = [];
        selectedLayer.value = null;

        // 2. 重新初始化地球容器
        const earthInitResult = await initializeEarthContainer();
        if (!earthInitResult) {
            addLog('地球容器初始化失败', 'error');
            return;
        }

        // 3. 等待地球就绪
        const earthReadyResult = await waitForEarthReady();
        if (!earthReadyResult) {
            addLog('地球容器就绪等待失败', 'error');
            return;
        }

        // 4. 重新初始化图层管理器
        const layerManagerResult = await autoInitializeLayerManager();
        if (!layerManagerResult) {
            addLog('图层管理器重新初始化失败', 'error');
            return;
        }

        addLog('强制重新初始化完成', 'success');

    } catch (error) {
        addLog(`强制重新初始化失败: ${error.message}`, 'error');
    }
};
</script>

<style scoped>
.test-container {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
}

.header h1 {
    margin: 0 0 10px 0;
    font-size: 2.5em;
}

.header p {
    margin: 0;
    font-size: 1.1em;
    opacity: 0.9;
}

.control-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
}

.section h3 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.2em;
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background: #007bff;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    min-width: 120px;
}

button:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-2px);
}

button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
}

button.danger {
    background: #dc3545;
}

button.danger:hover:not(:disabled) {
    background: #c82333;
}

.status-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.status-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
}

.status-section h3 {
    margin: 0 0 15px 0;
    color: #495057;
}

.status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
}

.status-item:last-child {
    border-bottom: none;
}

.label {
    font-weight: 600;
    color: #495057;
}

.value {
    color: #007bff;
    font-weight: 500;
}

.instance-list {
    max-height: 200px;
    overflow-y: auto;
}

.instance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 5px;
    background: white;
    border-radius: 5px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.instance-item.active {
    background: #d4edda;
    border-color: #c3e6cb;
}

.instance-item:hover {
    background: #f8f9fa;
}

.instance-id {
    font-weight: 600;
    color: #495057;
}

.instance-status {
    font-size: 12px;
    color: #6c757d;
    font-weight: 500;
}

.cesium-containers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.earth-container-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
    margin-bottom: 30px;
}

.earth-container-section h3 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.2em;
}

/* 初始化状态样式 */
.initialization-status {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #dee2e6;
}

.initialization-status h4 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.1em;
    font-weight: 600;
}

.status-indicators {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

.status-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.status-item.status-ok {
    background: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.status-item.overall-status {
    font-weight: 600;
    background: #e2e3e5;
    border-color: #d6d8db;
}

.status-item.overall-status.status-ok {
    background: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
}

.status-icon {
    font-size: 1.2em;
    margin-right: 8px;
    font-weight: bold;
}

.status-label {
    font-size: 0.9em;
    font-weight: 500;
}

.earth-content {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.earth-wrapper {
    flex: 1;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e9ecef;
}

.layer-panel {
    width: 350px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    padding: 15px;
    max-height: 500px;
    overflow-y: auto;
}

.layer-panel h4 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.1em;
    border-bottom: 2px solid #007bff;
    padding-bottom: 8px;
}

.layer-list {
    margin-bottom: 15px;
}

.layer-item {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    margin-bottom: 10px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.layer-item:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.layer-item.active {
    border-color: #007bff;
    background: #e3f2fd;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.layer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.layer-info {
    flex: 1;
}

.layer-name {
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    display: block;
}

.layer-type {
    font-size: 12px;
    color: #6c757d;
    background: #e9ecef;
    padding: 2px 6px;
    border-radius: 3px;
    margin-top: 2px;
    display: inline-block;
}

.layer-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.layer-toggle {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.layer-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.toggle-slider {
    background-color: #007bff;
}

input:checked+.toggle-slider:before {
    transform: translateX(20px);
}

.layer-opacity {
    display: flex;
    align-items: center;
    gap: 5px;
}

.layer-opacity input[type="range"] {
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: #e9ecef;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.layer-opacity input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
}

.layer-opacity input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    border: none;
}

.opacity-value {
    font-size: 11px;
    color: #6c757d;
    min-width: 30px;
    text-align: center;
}

.layer-details {
    font-size: 12px;
    color: #6c757d;
}

.layer-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.layer-description {
    font-style: italic;
    line-height: 1.3;
}

.layer-actions {
    display: flex;
    gap: 10px;
}

.refresh-btn,
.focus-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
    min-width: auto;
}

.refresh-btn {
    background: #28a745;
}

.refresh-btn:hover:not(:disabled) {
    background: #218838;
}

.focus-btn {
    background: #17a2b8;
}

.focus-btn:hover:not(:disabled) {
    background: #138496;
}

.container-section {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
}

.container-section h3 {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1.1em;
}

.cesium-container {
    width: 100%;
    height: 300px;
    background: #000;
    border-radius: 5px;
    border: 2px solid #e9ecef;
}

.log-panel {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
}

.log-panel h3 {
    margin: 0 0 15px 0;
    color: #495057;
}

.log-content {
    height: 300px;
    overflow-y: auto;
    background: #000;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

.log-item {
    margin-bottom: 5px;
    display: flex;
    gap: 10px;
}

.log-time {
    color: #6c757d;
    min-width: 80px;
}

.log-message {
    color: #fff;
}

.log-item.info .log-message {
    color: #17a2b8;
}

.log-item.success .log-message {
    color: #28a745;
}

.log-item.error .log-message {
    color: #dc3545;
}

.log-item.event .log-message {
    color: #ffc107;
}

.clear-logs {
    background: #6c757d;
    font-size: 12px;
    padding: 8px 12px;
    min-width: auto;
}

.clear-logs:hover:not(:disabled) {
    background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .test-container {
        padding: 10px;
    }

    .control-panel {
        grid-template-columns: 1fr;
    }

    .status-panel {
        grid-template-columns: 1fr;
    }

    .cesium-containers {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-direction: column;
    }

    button {
        min-width: auto;
        width: 100%;
    }

    .earth-content {
        flex-direction: column;
    }

    .layer-panel {
        width: 100%;
        max-height: 300px;
    }

    .earth-wrapper {
        height: 400px;
    }
}
</style>
