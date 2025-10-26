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
                <h4>图层管理</h4>
                <div class="layer-controls">
                    <button @click="addTdtVecLayer" :disabled="!ffCesium">天地图矢量</button>
                    <button @click="addTdtCvaLayer" :disabled="!ffCesium">天地图注记</button>
                    <button @click="addTdtCiaLayer" :disabled="!ffCesium">天地图影像注记</button>
                    <button @click="addTdtCtaLayer" :disabled="!ffCesium">天地图道路</button>
                    <button @click="addArcgisImgLayer" :disabled="!ffCesium">ArcGIS影像</button>
                    <button @click="addCustomLayer" :disabled="!ffCesium">自定义图层</button>
                    <button @click="addWmsLayer" :disabled="!ffCesium">WMS图层</button>
                </div>
                <div class="layer-list">
                    <h5>已加载图层 ({{ loadedLayers.length }})</h5>
                    <div v-for="(layer, index) in loadedLayers" :key="index" class="layer-item">
                        <span class="layer-name">{{ layer.name }}</span>
                        <div class="layer-controls-small">
                            <input type="range" min="0" max="1" step="0.1" :value="layer.alpha"
                                @input="setLayerAlpha(layer, $event.target.value)" class="alpha-slider" />
                            <button @click="removeLayer(layer)" class="remove-btn">×</button>
                        </div>
                    </div>
                    <div class="layer-test-controls">
                        <button @click="runLayerTests" :disabled="!ffCesium" class="test-btn">运行图层测试</button>
                        <button @click="clearAllLayers" :disabled="!ffCesium || loadedLayers.length === 0"
                            class="clear-btn">清除所有图层</button>
                    </div>
                </div>
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
            positionUpdateTimer: null,
            loadedLayers: [],
            layerCounter: 0
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

            // 清理所有图层
            this.clearAllLayers();

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
        },

        // ========== 图层管理方法 ==========

        // 添加天地图矢量图层
        addTdtVecLayer() {
            if (this.ffCesium) {
                try {
                    const layer = this.ffCesium.addTdtVecLayer();
                    this.addLayerToList('天地图矢量', layer);
                    this.addLog('天地图矢量图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加天地图矢量图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加天地图注记图层
        addTdtCvaLayer() {
            if (this.ffCesium) {
                try {
                    const layer = this.ffCesium.addTdtCvaLayer();
                    this.addLayerToList('天地图注记', layer);
                    this.addLog('天地图注记图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加天地图注记图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加天地图影像注记图层
        addTdtCiaLayer() {
            if (this.ffCesium) {
                try {
                    const layer = this.ffCesium.addTdtCiaLayer();
                    this.addLayerToList('天地图影像注记', layer);
                    this.addLog('天地图影像注记图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加天地图影像注记图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加天地图道路图层
        addTdtCtaLayer() {
            if (this.ffCesium) {
                try {
                    const layer = this.ffCesium.addTdtCtaLayer();
                    this.addLayerToList('天地图道路', layer);
                    this.addLog('天地图道路图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加天地图道路图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加ArcGIS影像图层
        addArcgisImgLayer() {
            if (this.ffCesium) {
                try {
                    const layer = this.ffCesium.addArcgisImgLayer();
                    this.addLayerToList('ArcGIS影像', layer);
                    this.addLog('ArcGIS影像图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加ArcGIS影像图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加自定义图层
        addCustomLayer() {
            if (this.ffCesium) {
                try {
                    // 使用OpenStreetMap作为示例
                    const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    const layer = this.ffCesium.addCustomLayer(url);
                    this.addLayerToList('OpenStreetMap', layer);
                    this.addLog('OpenStreetMap图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加自定义图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加WMS图层
        addWmsLayer() {
            if (this.ffCesium) {
                try {
                    // 使用示例WMS服务
                    const url = 'https://demo.boundlessgeo.com/geoserver/ows';
                    const layerName = 'ne:ne_10m_admin_0_countries';
                    const layer = this.ffCesium.addWmslayer(url, layerName);
                    this.addLayerToList('WMS国家边界', layer);
                    this.addLog('WMS图层已添加', 'success');
                } catch (error) {
                    this.addLog(`添加WMS图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 添加图层到列表
        addLayerToList(name, layer) {
            const layerInfo = {
                id: ++this.layerCounter,
                name: name,
                layer: layer,
                alpha: 1.0,
                visible: true
            };
            this.loadedLayers.push(layerInfo);
        },

        // 设置图层透明度
        setLayerAlpha(layerInfo, alpha) {
            if (layerInfo.layer) {
                layerInfo.layer.alpha = parseFloat(alpha);
                layerInfo.alpha = parseFloat(alpha);
                this.addLog(`图层 ${layerInfo.name} 透明度设置为 ${alpha}`, 'info');
            }
        },

        // 移除图层
        removeLayer(layerInfo) {
            if (this.ffCesium && layerInfo.layer) {
                try {
                    this.ffCesium.removeMapLayer(layerInfo.layer);
                    const index = this.loadedLayers.findIndex(l => l.id === layerInfo.id);
                    if (index > -1) {
                        this.loadedLayers.splice(index, 1);
                    }
                    this.addLog(`图层 ${layerInfo.name} 已移除`, 'success');
                } catch (error) {
                    this.addLog(`移除图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 清除所有图层
        clearAllLayers() {
            if (this.ffCesium) {
                try {
                    this.loadedLayers.forEach(layerInfo => {
                        if (layerInfo.layer) {
                            this.ffCesium.removeMapLayer(layerInfo.layer);
                        }
                    });
                    this.loadedLayers = [];
                    this.addLog('所有图层已清除', 'success');
                } catch (error) {
                    this.addLog(`清除图层失败: ${error.message}`, 'error');
                }
            }
        },

        // 图层测试功能
        runLayerTests() {
            this.addLog('开始图层管理测试...', 'info');

            // 测试1: 添加多种图层
            setTimeout(() => {
                this.addTdtVecLayer();
            }, 500);

            setTimeout(() => {
                this.addTdtCvaLayer();
            }, 1000);

            setTimeout(() => {
                this.addArcgisImgLayer();
            }, 1500);

            // 测试2: 调整透明度
            setTimeout(() => {
                if (this.loadedLayers.length > 0) {
                    this.setLayerAlpha(this.loadedLayers[0], 0.5);
                }
            }, 2000);

            // 测试3: 移除图层
            setTimeout(() => {
                if (this.loadedLayers.length > 1) {
                    this.removeLayer(this.loadedLayers[1]);
                }
            }, 3000);

            this.addLog('图层管理测试完成', 'success');
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

/* 图层管理样式 */
.layer-controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    margin-bottom: 10px;
}

.layer-controls button {
    padding: 6px 8px;
    font-size: 11px;
    margin-bottom: 5px;
}

.layer-list {
    margin-top: 10px;
    border-top: 1px solid #333;
    padding-top: 10px;
}

.layer-list h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    color: #00d4ff;
}

.layer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 5px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.layer-name {
    font-size: 11px;
    color: #ccc;
    flex: 1;
}

.layer-controls-small {
    display: flex;
    align-items: center;
    gap: 5px;
}

.alpha-slider {
    width: 60px;
    height: 20px;
    background: #333;
    outline: none;
    border-radius: 10px;
    -webkit-appearance: none;
    appearance: none;
}

.alpha-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
}

.alpha-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.remove-btn {
    width: 20px;
    height: 20px;
    padding: 0;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
}

.remove-btn:hover {
    background: #c82333;
}

.layer-test-controls {
    margin-top: 10px;
    display: flex;
    gap: 5px;
}

.test-btn {
    background: #28a745;
    flex: 1;
}

.test-btn:hover:not(:disabled) {
    background: #218838;
}

.clear-btn {
    background: #dc3545;
    flex: 1;
}

.clear-btn:hover:not(:disabled) {
    background: #c82333;
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

    .layer-controls {
        grid-template-columns: 1fr;
    }

    .layer-controls button {
        font-size: 10px;
        padding: 5px 6px;
    }

    .layer-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }

    .layer-controls-small {
        width: 100%;
        justify-content: space-between;
    }

    .alpha-slider {
        width: 80px;
    }
}
</style>
