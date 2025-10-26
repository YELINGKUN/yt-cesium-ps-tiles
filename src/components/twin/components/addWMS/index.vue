<template>
  <!-- <div>=</div> -->
</template>
<script lang="ts" setup>
import {
  onMounted,
  onBeforeUnmount,
  ref,
  reactive,
  defineProps,
  watch,
  computed,
  nextTick,
} from "vue";
const props = defineProps({
  ffCesium: {
    type: Object,
    required: true,
  },
  layerWMS: {
    type: Array,
    required: true,
  },
});
const ffCesium = computed(() => {
  return props.ffCesium;
});
const addWMS = (data: String) => {
  let url = "http://192.168.9.212:8080/geoserver/sl/wms";
  let layerName = data;
  let wmslayer = ffCesium.value.addWmslayer(url, layerName);
  return wmslayer;
};
let parcelMap: Object;
let canal: Object;
let boundary: Object;
let regionRiver: Object;
const showAllWMS = () => {
  props.layerWMS.map((item) => {
    if (item.name == "地块图") {
      if (item.show) {
        parcelMap = addWMS(item.data);
        // item.wms = parcelMap;
      }
    } else if (item.name == "渠系图") {
      if (item.show) {
        canal = addWMS(item.data);
      }
    } else if (item.name == "汤原县边界图") {
      if (item.show) {
        boundary = addWMS(item.data);
      }
    } else if (item.name == "佳木斯水系") {
      if (item.show) {
        regionRiver = addWMS(item.data);
      }
    }
  });
};
showAllWMS();
// 自定义函数比较对象属性的变化
function findChanges(newArray, oldArray) {
  let changes = [];
  newArray.forEach((newItem, index) => {
    const oldItem = oldArray[index];
    if (oldItem && newItem.show !== oldItem.show) {
      changes.push({ old: oldItem, new: newItem });
    }
  });
  return changes;
}
// 不会直接比较数组内对象的属性变化
//   () => props.layerWMS.map((item) => item.show),
watch(
  () => props.layerWMS[0].show,
  (newVal) => {
    if (newVal) {
      parcelMap = addWMS(props.layerWMS[0].data);
    } else {
      ffCesium.value.removeMapLayer(parcelMap);
      parcelMap = "";
    }
  }
);
watch(
  () => props.layerWMS[1].show,
  (newVal) => {
    if (newVal) {
      canal = addWMS(props.layerWMS[1].data);
    } else {
      ffCesium.value.removeMapLayer(canal);
      canal = "";
    }
  }
);
watch(
  () => props.layerWMS[2].show,
  (newVal) => {
    if (newVal) {
      boundary = addWMS(props.layerWMS[2].data);
    } else {
      ffCesium.value.removeMapLayer(boundary);
      boundary = "";
    }
  }
);
watch(
  () => props.layerWMS[3].show,
  (newVal) => {
    if (newVal) {
      regionRiver = addWMS(props.layerWMS[3].data);
    } else {
      ffCesium.value.removeMapLayer(regionRiver);
      regionRiver = "";
    }
  }
);
// watch(
//   () => props.layerWMS,
//   (newValue, oldValue) => {
//     newValue.map((node) => {
//       console.log("itemwwww", node);
//       //   if (node.name == "地块图") {
//       //     if (node.show) {
//       //       parcelMap = addWMS(node.data);
//       //     } else {
//       //       ffCesium.value.removeMapLayer(parcelMap);
//       //       parcelMap = null;
//       //     }
//       //   }
//     });
//   },
//   { deep: true }
// );
</script>

<style scoped></style>
