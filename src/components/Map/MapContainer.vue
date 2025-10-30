<template>
    <div class="map-container">
        <div :id="containerId" class="cesium-viewer"></div>
    </div>
</template>

<script>
import CesiumPlusManager from '../../CesiumPlus/core/CesiumPlusManager.js';

export default {
    name: 'MapContainer',
    props: {
        containerId: {
            type: String,
            default: 'mapContainer'
        },
        viewerOptions: {
            type: Object,
            default: () => ({
                animation: false,
                baseLayerPicker: false,
                baseLayer: false,
                fullscreenButton: false,
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
    },
    data() {
        return {
            ffCesium: null
        };
    },
    mounted() {
        this.initMap();
    },
    beforeUnmount() {
        this.destroyMap();
    },
    methods: {
        initMap() {
            try {
                // 使用 CesiumPlusManager 创建实例
                this.ffCesium = CesiumPlusManager.getInstance(this.containerId, this.viewerOptions, true);
                this.$emit('map-ready', this.ffCesium);
                console.log(`MapContainer: 使用 CesiumPlusManager 创建地图实例 [${this.containerId}]`);
            } catch (error) {
                console.error('MapContainer: 地图初始化失败', error);
                this.$emit('map-error', error);
            }
        },

        destroyMap() {
            try {
                if (this.containerId) {
                    // 使用 CesiumPlusManager 销毁实例
                    CesiumPlusManager.destroyInstance(this.containerId);
                    console.log(`MapContainer: 使用 CesiumPlusManager 销毁地图实例 [${this.containerId}]`);
                }
                this.ffCesium = null;
            } catch (error) {
                console.error('MapContainer: 地图销毁失败', error);
            }
        },

        getFFCesium() {
            return this.ffCesium;
        },

        // 获取当前实例
        getCurrentInstance() {
            return CesiumPlusManager.getCurrentInstance();
        },

        // 切换实例
        switchToInstance(instanceId) {
            return CesiumPlusManager.switchToInstance(instanceId);
        },

        // 获取所有实例
        getAllInstances() {
            return CesiumPlusManager.getAllInstances();
        }
    }
};
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
}

.cesium-viewer {
    width: 100%;
    height: 100%;
}
</style>
