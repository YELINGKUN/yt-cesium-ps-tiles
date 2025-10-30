<template>
    <BaseLayout>
        <template #sidebar>
            <LeftToolBar />
        </template>

        <div class="content-full">
            <MapContainer :container-id="mapIdRef" :viewer-options="viewerOptions" @map-ready="onMapReady"
                @map-error="onMapError" />
        </div>

        <template #right>
            <div class="ps-right-panel">
                <!-- 右侧面板内容（例如图层、属性、工具） -->
            </div>
        </template>
    </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import MapContainer from '@/components/Map/MapContainer.vue';
import LeftToolBar from '@/components/Map/LeftToolBar.vue';
import CesiumPlusManager from '@/CesiumPlus/core/CesiumPlusManager.js';

//#region 地图相关实例
const mapIdRef = ref('psMap');
// 地图实例
const mapInstance = ref(null);
// Cesium Viewer 配置
const viewerOptions = {
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
};
//#endregion

function onMapReady(instance) {
    mapInstance.value = instance;
}

function onMapError(error) {
    // 这里可接入全局消息提示
    console.error('PsIndex: 地图初始化失败', error);
}

onMounted(() => {
    const ss = CesiumPlusManager.getCurrentInstance();
    console.log('PsIndex: 地图初始化完成', ss);
});
</script>

<style scoped>
.content-full {
    width: 100%;
    height: 100%;
}

.ps-right-panel {
    width: 100%;
    height: 100%;
}
</style>
