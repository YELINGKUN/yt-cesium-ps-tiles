<template>
    <div class="earth-container">
        <!-- Cesium容器 -->
        <div :id="containerId" class="cesium-viewer"></div>

        <!-- 控制面板 -->
        <div class="control-panel">
            <div class="control-group">
                <h4>地图控制</h4>
                <button @click="switchTo2D" :disabled="!ffCesium">2D模式</button>
                <button @click="switchTo3D" :disabled="!ffCesium">3D模式</button>
                <button @click="resetView" :disabled="!ffCesium">重置视角</button>
            </div>

            <div class="control-group">
                <h4>图层控制</h4>
                <button @click="toggleTerrain" :disabled="!ffCesium">
                    {{ terrainEnabled ? '关闭地形' : '开启地形' }}
                </button>
                <button @click="toggleImagery" :disabled="!ffCesium">
                    {{ imageryEnabled ? '关闭影像' : '开启影像' }}
                </button>
            </div>

            <div class="control-group">
                <h4>状态信息</h4>
                <div class="status-info">
                    <span>经度: {{ currentPosition.lng.toFixed(6) }}</span>
                    <span>纬度: {{ currentPosition.lat.toFixed(6) }}</span>
                    <span>高度: {{ currentPosition.height.toFixed(0) }}m</span>
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>正在加载地球...</p>
        </div>
    </div>
</template>

<script>
import FFCesium from './twin/FFCesium/core';

export default {
    name: 'EarthContainer',
    props: {
        containerId: {
            type: String,
            default: 'earthContainer'
        },
        viewerOptions: {
            type: Object,
            default: () => ({
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
            })
        },
        initialView: {
            type: Object,
            default: () => ({
                lng: 129.85897571573392,
                lat: 46.62706812460703,
                height: 8000,
                pitchRadiu: -40,
            })
        }
    },
    data() {
        return {
            ffCesium: null,
            loading: true,
            terrainEnabled: true,
            imageryEnabled: true,
            currentPosition: {
                lng: 0,
                lat: 0,
                height: 0
            },
            positionUpdateTimer: null
        };
    },
    mounted() {
        this.initEarth();
    },
    beforeUnmount() {
        this.cleanup();
    },
    methods: {
        // 初始化地球
        async initEarth() {
            try {
                this.loading = true;
                this.addLog('开始初始化地球容器...', 'info');

                // 创建FFCesium实例
                this.ffCesium = new FFCesium(this.containerId, this.viewerOptions);

                // 等待Cesium完全加载
                await this.waitForCesiumLoad();

                // 设置初始视图
                this.setInitialView();

                // 添加地形数据
                this.addTerrainData();

                // 添加地图图层
                this.addMapLayers();

                // 设置点击事件
                this.setupClickEvents();

                // 开始位置更新
                this.startPositionUpdate();

                this.loading = false;
                this.addLog('地球容器初始化完成', 'success');

                // 触发初始化完成事件
                this.$emit('earth-ready', this.ffCesium);

            } catch (error) {
                this.loading = false;
                this.addLog(`地球容器初始化失败: ${error.message}`, 'error');
                console.error('Earth initialization error:', error);
            }
        },

        // 等待Cesium加载完成
        waitForCesiumLoad() {
            return new Promise((resolve) => {
                const checkLoad = () => {
                    if (this.ffCesium && this.ffCesium.viewer && this.ffCesium.viewer.scene) {
                        resolve();
                    } else {
                        setTimeout(checkLoad, 100);
                    }
                };
                checkLoad();
            });
        },

        // 设置初始视图
        setInitialView() {
            if (this.ffCesium) {
                this.ffCesium.setView(this.initialView);
                this.addLog(`设置初始视图: ${this.initialView.lng}, ${this.initialView.lat}`, 'info');
            }
        },

        // 添加地形数据
        addTerrainData() {
            if (this.ffCesium) {
                try {
                    this.ffCesium.addTerrain("http://data.marsgis.cn/terrain");
                    this.terrainEnabled = true;
                    this.addLog('地形数据加载成功', 'success');
                } catch (error) {
                    this.addLog(`地形数据加载失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加地图图层
        addMapLayers() {
            if (this.ffCesium) {
                try {
                    this.ffCesium.addTdtImgLayer();
                    this.imageryEnabled = true;
                    this.addLog('地图图层加载成功', 'success');
                } catch (error) {
                    this.addLog(`地图图层加载失败: ${error.message}`, 'error');
                }
            }
        },

        // 设置点击事件
        setupClickEvents() {
            if (this.ffCesium) {
                this.ffCesium.getClickModel(this.onModelClick, this.onEmptyClick);
                this.addLog('点击事件设置完成', 'info');
            }
        },

        // 模型点击回调
        onModelClick(model) {
            this.addLog(`点击了模型: ${model.id || '未知'}`, 'event');
            this.$emit('model-click', model);
        },

        // 空白区域点击回调
        onEmptyClick() {
            this.addLog('点击了空白区域', 'event');
            this.$emit('empty-click');
        },

        // 开始位置更新
        startPositionUpdate() {
            this.positionUpdateTimer = setInterval(() => {
                if (this.ffCesium && this.ffCesium.viewer) {
                    const camera = this.ffCesium.viewer.camera;
                    const position = camera.positionCartographic;

                    this.currentPosition = {
                        lng: this.ffCesium.Cesium.Math.toDegrees(position.longitude),
                        lat: this.ffCesium.Cesium.Math.toDegrees(position.latitude),
                        height: position.height
                    };
                }
            }, 1000);
        },

        // 切换到2D模式
        switchTo2D() {
            if (this.ffCesium) {
                this.ffCesium.switchTo2D();
                this.addLog('切换到2D模式', 'info');
            }
        },

        // 切换到3D模式
        switchTo3D() {
            if (this.ffCesium) {
                this.ffCesium.switchTo3D();
                this.addLog('切换到3D模式', 'info');
            }
        },

        // 重置视角
        resetView() {
            if (this.ffCesium) {
                this.ffCesium.setView(this.initialView);
                this.addLog('视角已重置', 'info');
            }
        },

        // 切换地形
        toggleTerrain() {
            if (this.ffCesium) {
                if (this.terrainEnabled) {
                    // 关闭地形
                    this.ffCesium.viewer.scene.globe.enableLighting = false;
                    this.terrainEnabled = false;
                    this.addLog('地形已关闭', 'info');
                } else {
                    // 开启地形
                    this.ffCesium.viewer.scene.globe.enableLighting = true;
                    this.terrainEnabled = true;
                    this.addLog('地形已开启', 'info');
                }
            }
        },

        // 切换影像
        toggleImagery() {
            if (this.ffCesium) {
                if (this.imageryEnabled) {
                    // 关闭影像
                    this.ffCesium.viewer.scene.globe.show = false;
                    this.imageryEnabled = false;
                    this.addLog('影像已关闭', 'info');
                } else {
                    // 开启影像
                    this.ffCesium.viewer.scene.globe.show = true;
                    this.imageryEnabled = true;
                    this.addLog('影像已开启', 'info');
                }
            }
        },

        // 添加日志
        addLog(message, type = 'info') {
            this.$emit('log', { message, type, time: new Date().toLocaleTimeString() });
        },

        // 清理资源
        cleanup() {
            if (this.positionUpdateTimer) {
                clearInterval(this.positionUpdateTimer);
                this.positionUpdateTimer = null;
            }

            if (this.ffCesium && this.ffCesium.viewer) {
                this.ffCesium.viewer.destroy();
                this.ffCesium = null;
            }

            this.addLog('地球容器已清理', 'info');
        },

        // 获取FFCesium实例
        getFFCesium() {
            return this.ffCesium;
        },

        // 飞行到指定位置
        flyTo(options) {
            if (this.ffCesium) {
                this.ffCesium.flyTo(options);
                this.addLog(`飞行到: ${options.lng}, ${options.lat}`, 'info');
            }
        },

        // 添加实体
        addEntity(options) {
            if (this.ffCesium) {
                const entity = this.ffCesium.addFFEntity(options);
                this.addLog('实体已添加', 'info');
                return entity;
            }
        },

        // 移除实体
        removeEntity(entity) {
            if (this.ffCesium) {
                this.ffCesium.viewer.entities.remove(entity);
                this.addLog('实体已移除', 'info');
            }
        }
    }
};
</script>

<style scoped>
.earth-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.cesium-viewer {
    width: 100%;
    height: 100%;
    background: #000;
}

.control-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    min-width: 200px;
    z-index: 1000;
}

.control-group {
    margin-bottom: 15px;
}

.control-group:last-child {
    margin-bottom: 0;
}

.control-group h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #00d4ff;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
}

.control-group button {
    display: block;
    width: 100%;
    margin-bottom: 8px;
    padding: 8px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.3s;
}

.control-group button:hover:not(:disabled) {
    background: #0056b3;
}

.control-group button:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.status-info {
    font-size: 11px;
    line-height: 1.4;
}

.status-info span {
    display: block;
    margin-bottom: 2px;
    color: #ccc;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #333;
    border-top: 4px solid #00d4ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-overlay p {
    color: white;
    font-size: 16px;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .control-panel {
        top: 10px;
        right: 10px;
        padding: 10px;
        min-width: 150px;
    }

    .control-group h4 {
        font-size: 12px;
    }

    .control-group button {
        padding: 6px 10px;
        font-size: 11px;
    }

    .status-info {
        font-size: 10px;
    }
}
</style>
