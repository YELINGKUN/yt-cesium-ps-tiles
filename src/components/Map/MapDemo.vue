<template>
    <div class="map-demo">
        <h2>MapContainer 组件测试</h2>

        <!-- 地图容器 -->
        <div class="map-wrapper">
            <MapContainer ref="mapContainer" container-id="demoMapContainer" :viewer-options="viewerOptions"
                @map-ready="onMapReady" />
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
            <h3>地图控制</h3>
            <div class="control-group">
                <button @click="testGetInstance" :disabled="!mapReady">获取地图实例</button>
                <button @click="testFlyTo" :disabled="!mapReady">飞行到北京</button>
                <button @click="testSetView" :disabled="!mapReady">设置视图到上海</button>
                <button @click="testGetAllInstances" :disabled="!mapReady">获取所有实例</button>
                <button @click="testGetCurrentInstance" :disabled="!mapReady">获取当前实例</button>
            </div>

            <div class="control-group">
                <h4>状态信息</h4>
                <div class="status-info">
                    <p>地图状态: {{ mapReady ? '已就绪' : '未就绪' }}</p>
                    <p>当前位置: {{ currentPosition.lng.toFixed(6) }}, {{ currentPosition.lat.toFixed(6) }}</p>
                    <p>高度: {{ currentPosition.height.toFixed(0) }}m</p>
                </div>
            </div>

            <div class="control-group">
                <h4>事件日志</h4>
                <div class="log-container">
                    <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
                        <span class="log-time">{{ log.time }}</span>
                        <span class="log-message">{{ log.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MapContainer from './MapContainer.vue';

export default {
    name: 'MapDemo',
    components: {
        MapContainer
    },
    data() {
        return {
            mapReady: false,
            ffCesium: null,
            logs: [],
            viewerOptions: {
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
            }
        };
    },
    methods: {
        // 地图就绪回调
        onMapReady(ffCesium) {
            this.mapReady = true;
            this.ffCesium = ffCesium;

            this.addLog('地图初始化完成', 'success');
            console.log('地图实例:', ffCesium);

            // 设置初始视图
            ffCesium.setView({
                lng: 116.3974,
                lat: 39.9093,
                height: 10000,
                pitchRadiu: -30
            });

            // 添加默认图层
            ffCesium.addTdtImgLayer();
        },

        // 测试获取地图实例
        testGetInstance() {
            const ffCesium = this.$refs.mapContainer.getFFCesium();
            this.addLog(`获取实例成功 - FFCesium: ${!!ffCesium}`, 'success');
        },

        // 测试飞行到北京
        testFlyTo() {
            if (this.ffCesium) {
                this.ffCesium.flyTo({
                    lng: 116.3974,
                    lat: 39.9093,
                    height: 5000,
                    pitchRadiu: -45
                });
                this.addLog('飞行到北京', 'info');
            }
        },

        // 测试设置视图到上海
        testSetView() {
            if (this.ffCesium) {
                this.ffCesium.setView({
                    lng: 121.4737,
                    lat: 31.2304,
                    height: 8000,
                    pitchRadiu: -30
                });
                this.addLog('设置视图到上海', 'info');
            }
        },

        // 测试获取所有实例
        testGetAllInstances() {
            const instances = this.$refs.mapContainer.getAllInstances();
            this.addLog(`获取所有实例: ${Object.keys(instances).length} 个`, 'info');
            console.log('所有实例:', instances);
        },

        // 测试获取当前实例
        testGetCurrentInstance() {
            const currentInstance = this.$refs.mapContainer.getCurrentInstance();
            this.addLog(`当前实例: ${currentInstance ? '存在' : '不存在'}`, 'info');
            console.log('当前实例:', currentInstance);
        },

        // 添加日志
        addLog(message, type = 'info') {
            this.logs.unshift({
                message,
                type,
                time: new Date().toLocaleTimeString()
            });

            // 限制日志数量
            if (this.logs.length > 50) {
                this.logs = this.logs.slice(0, 50);
            }
        }
    }
};
</script>

<style scoped>
.map-demo {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f5f5;
}

.map-demo h2 {
    margin: 0;
    padding: 15px;
    background: #007bff;
    color: white;
    text-align: center;
}

.map-wrapper {
    flex: 1;
    position: relative;
    margin: 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 300px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
}

.control-panel h3 {
    margin: 0 0 15px 0;
    color: #00d4ff;
    text-align: center;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
}

.control-group {
    margin-bottom: 15px;
}

.control-group h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #00d4ff;
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

.status-info p {
    margin: 0 0 5px 0;
    color: #ccc;
}

.log-container {
    max-height: 200px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px;
}

.log-item {
    display: flex;
    margin-bottom: 4px;
    font-size: 11px;
    padding: 2px 4px;
    border-radius: 2px;
}

.log-item.success {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
}

.log-item.error {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
}

.log-item.event {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
}

.log-item.info {
    background: rgba(23, 162, 184, 0.2);
    color: #17a2b8;
}

.log-time {
    margin-right: 8px;
    opacity: 0.7;
    min-width: 60px;
}

.log-message {
    flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .control-panel {
        width: 250px;
        top: 10px;
        right: 10px;
    }

    .map-demo h2 {
        font-size: 18px;
        padding: 10px;
    }
}
</style>
