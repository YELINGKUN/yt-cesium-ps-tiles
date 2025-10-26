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
            </div>
        </div>

        <!-- 状态显示 -->
        <div class="status-panel">
            <div class="status-section">
                <h3>当前状态</h3>
                <div class="status-item">
                    <span class="label">当前实例ID:</span>
                    <span class="value">{{ currentInstanceId || '无' }}</span>
                </div>
                <div class="status-item">
                    <span class="label">总实例数:</span>
                    <span class="value">{{ stats.totalInstances }}</span>
                </div>
                <div class="status-item">
                    <span class="label">默认实例ID:</span>
                    <span class="value">{{ stats.defaultInstanceId || '无' }}</span>
                </div>
            </div>

            <div class="status-section">
                <h3>实例列表</h3>
                <div class="instance-list">
                    <div v-for="instance in instances" :key="instance.id" class="instance-item"
                        :class="{ active: instance.isCurrent }">
                        <span class="instance-id">{{ instance.id }}</span>
                        <span class="instance-status">
                            {{ instance.isCurrent ? '当前' : '' }}
                            {{ instance.isDefault ? '默认' : '' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cesium容器 -->
        <div class="cesium-containers">
            <div class="container-section">
                <h3>实例1 - 简化配置</h3>
                <div id="cesiumContainer1" class="cesium-container"></div>
            </div>

            <div class="container-section">
                <h3>实例2 - 完整配置</h3>
                <div id="cesiumContainer2" class="cesium-container"></div>
            </div>

            <div class="container-section">
                <h3>实例3 - 3D模式</h3>
                <div id="cesiumContainer3" class="cesium-container"></div>
            </div>
        </div>

        <!-- Vue3地球容器组件 -->
        <div class="earth-container-section">
            <h3>Vue3地球容器组件</h3>
            <div class="earth-wrapper">
                <EarthContainer container-id="vueEarthContainer" :viewer-options="earthViewerOptions"
                    :initial-view="earthInitialView" @earth-ready="onEarthReady" @model-click="onModelClick"
                    @empty-click="onEmptyClick" @log="onEarthLog" />
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

<script>
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

export default {
    name: 'CesiumPlusManagerTest',
    components: {
        EarthContainer
    },
    data() {
        return {
            loading: false,
            testing: false,
            instances: [],
            currentInstanceId: null,
            stats: {
                totalInstances: 0,
                currentInstanceId: null,
                defaultInstanceId: null,
                instanceIds: [],
                hasCurrentInstance: false,
                hasDefaultInstance: false
            },
            logs: [],
            eventListenerCallback: null,
            // Vue3地球容器相关数据
            earthViewerOptions: {
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
            },
            earthInitialView: {
                lng: 129.85897571573392,
                lat: 46.62706812460703,
                height: 8000,
                pitchRadiu: -40,
            },
            earthInstance: null
        };
    },
    computed: {
        hasInstance1() {
            return this.stats.instanceIds.includes('cesiumContainer1');
        },
        hasInstance2() {
            return this.stats.instanceIds.includes('cesiumContainer2');
        },
        hasInstance3() {
            return this.stats.instanceIds.includes('cesiumContainer3');
        },
        currentInstance() {
            return CesiumPlusManager.getCurrentInstance();
        }
    },
    mounted() {
        this.addLog('组件已挂载，准备测试 CesiumPlusManager', 'info');
        this.updateStatus();
    },
    beforeUnmount() {
        // 清理事件监听器
        if (this.eventListenerCallback) {
            CesiumPlusManager.offInstanceSwitched(this.eventListenerCallback);
        }

        // 清理所有实例
        CesiumPlusManager.destroyAllInstances();
        this.addLog('组件卸载，已清理所有实例', 'info');
    },
    methods: {
        // 添加日志
        addLog(message, type = 'info') {
            const time = new Date().toLocaleTimeString();
            this.logs.push({ time, message, type });

            // 自动滚动到底部
            this.$nextTick(() => {
                if (this.$refs.logContent) {
                    this.$refs.logContent.scrollTop = this.$refs.logContent.scrollHeight;
                }
            });
        },

        // 清空日志
        clearLogs() {
            this.logs = [];
        },

        // 更新状态
        updateStatus() {
            this.stats = CesiumPlusManager.getStats();
            this.currentInstanceId = CesiumPlusManager.getCurrentInstanceId();
            this.instances = CesiumPlusManager.getAllInstancesInfo();
        },

        // 创建多个实例
        async createInstances() {
            this.loading = true;
            this.addLog('开始创建多个 CesiumPlus 实例...', 'info');

            try {
                const result = createMultipleInstances();
                if (result) {
                    this.addLog('成功创建多个实例', 'success');
                    this.updateStatus();
                } else {
                    this.addLog('创建实例失败', 'error');
                }
            } catch (error) {
                this.addLog(`创建实例出错: ${error.message}`, 'error');
            } finally {
                this.loading = false;
            }
        },

        // 切换到实例1
        switchToInstance1() {
            const result = CesiumPlusManager.switchToInstance('cesiumContainer1');
            this.addLog(`切换到实例1: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
            this.updateStatus();
        },

        // 切换到实例2
        switchToInstance2() {
            const result = CesiumPlusManager.switchToInstance('cesiumContainer2');
            this.addLog(`切换到实例2: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
            this.updateStatus();
        },

        // 切换到实例3
        switchToInstance3() {
            const result = CesiumPlusManager.switchToInstance('cesiumContainer3');
            this.addLog(`切换到实例3: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
            this.updateStatus();
        },

        // 执行实例操作
        executeOperations() {
            this.addLog('开始执行实例操作...', 'info');
            try {
                instanceOperationsExample();
                this.addLog('实例操作执行完成', 'success');
            } catch (error) {
                this.addLog(`实例操作出错: ${error.message}`, 'error');
            }
        },

        // 测试事件监听
        testEventListeners() {
            this.addLog('开始测试事件监听...', 'info');

            // 移除之前的监听器
            if (this.eventListenerCallback) {
                CesiumPlusManager.offInstanceSwitched(this.eventListenerCallback);
            }

            // 添加新的监听器
            this.eventListenerCallback = (event) => {
                this.addLog(`收到切换事件: 从 ${event.detail.fromId} 到 ${event.detail.toId}`, 'event');
            };

            CesiumPlusManager.onInstanceSwitched(this.eventListenerCallback);

            // 执行事件监听示例
            try {
                eventListenerExample();
                this.addLog('事件监听测试完成', 'success');
            } catch (error) {
                this.addLog(`事件监听测试出错: ${error.message}`, 'error');
            }
        },

        // 销毁实例
        destroyInstance() {
            this.addLog('开始销毁实例2...', 'info');
            try {
                const result = CesiumPlusManager.destroyInstance('cesiumContainer2');
                this.addLog(`销毁实例2: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
                this.updateStatus();
            } catch (error) {
                this.addLog(`销毁实例出错: ${error.message}`, 'error');
            }
        },

        // 运行快速测试
        async runQuickTest() {
            this.testing = true;
            this.addLog('开始快速测试...', 'info');

            try {
                const result = quickTest();
                this.addLog(`快速测试完成: ${result ? '成功' : '失败'}`, result ? 'success' : 'error');
                this.updateStatus();
            } catch (error) {
                this.addLog(`快速测试出错: ${error.message}`, 'error');
            } finally {
                this.testing = false;
            }
        },

        // 运行性能测试
        async runPerformanceTest() {
            this.testing = true;
            this.addLog('开始性能测试...', 'info');

            try {
                const duration = performanceTest();
                if (duration > 0) {
                    this.addLog(`性能测试完成，耗时: ${duration.toFixed(2)}ms`, 'success');
                } else {
                    this.addLog('性能测试失败', 'error');
                }
                this.updateStatus();
            } catch (error) {
                this.addLog(`性能测试出错: ${error.message}`, 'error');
            } finally {
                this.testing = false;
            }
        },

        // 运行完整工作流程
        async runCompleteWorkflow() {
            this.testing = true;
            this.addLog('开始完整工作流程测试...', 'info');

            try {
                completeWorkflowExample();
                this.addLog('完整工作流程测试完成', 'success');
                this.updateStatus();
            } catch (error) {
                this.addLog(`完整工作流程测试出错: ${error.message}`, 'error');
            } finally {
                this.testing = false;
            }
        },

        // 清理所有实例
        clearAll() {
            this.addLog('开始清理所有实例...', 'info');
            try {
                CesiumPlusManager.destroyAllInstances();
                this.addLog('所有实例已清理', 'success');
                this.updateStatus();
            } catch (error) {
                this.addLog(`清理实例出错: ${error.message}`, 'error');
            }
        },

        // Vue3地球容器事件处理
        onEarthReady(ffCesiumInstance) {
            this.earthInstance = ffCesiumInstance;
            this.addLog('Vue3地球容器初始化完成', 'success');
        },

        onModelClick(model) {
            this.addLog(`Vue3地球容器 - 点击模型: ${model.id || '未知'}`, 'event');
        },

        onEmptyClick() {
            this.addLog('Vue3地球容器 - 点击空白区域', 'event');
        },

        onEarthLog(logData) {
            this.addLog(`[Vue3地球] ${logData.message}`, logData.type);
        }
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

.earth-wrapper {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e9ecef;
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
}
</style>
