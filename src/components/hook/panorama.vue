<template>
  <div class="box" v-show="getShow">
    <div class="canvasName">
      <img
        class="canvasImg"
        src="/public/img/mapServer/popLogo.png"
        alt=""
      />全景图
      <div class="showCanvas" id="viewer"></div>
      <div class="off" @click="offCanvas"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, defineProps, watch, computed, nextTick } from "vue";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import panoramaPng from "/public/img/mapServer/allImg.jpg";
// let panoramaPng = ref();
let viewer = ref();
const emit = defineEmits(["setShow"]);
const props = defineProps({
  show: {
    show: Boolean,
    required: true,
  },
  urlImg: {
    show: String,
    required: true,
  },
});
// let getShow = computed(() => props.show);//父变化时及时接收
let getShow = ref(props.show); //不能即使接收父变化，但是可以通过watch监听来修改，下面是只读的
let panoramaIng = ref(props.urlImg);

watch(
  () => props.show,
  (newValue) => {
    getShow.value = newValue;
  },
  { immediate: true }
);
watch(
  () => props.urlImg,
  (newValue) => {
    panoramaIng.value = newValue;
    nextTick(() => {
      init2();
    });
  }
  // { immediate: true }
);
onMounted(() => {
  // init2();
});
const offCanvas = () => {
  getShow.value = false;
  console.log("点关闭", getShow.value);

  emit("setShow", getShow.value);
};
const init2 = () => {
  viewer = new Viewer({
    container: document.querySelector("#viewer"),
    panorama: panoramaPng,
    // panorama: panoramaIng.value,
    navbar: ["autorotate", "zoom", "caption", "fullscreen"],
    size: {
      width: "500px",
      height: "300px",
    },
  });
};
</script>
<style lang="scss" scoped>
.offCanvas {
  display: none;
}
.box {
  position: absolute;
  top: 30px;
  left: 500px;
  z-index: 9999;
}
.showCanvas {
  width: 500px;
  height: 300px;
  margin: auto;
  // width: 500px;
  // height: 300px;
  // width: 100%;
  // height: 100%;
}
.canvasName {
  width: 520px;
  height: 340px;
  line-height: 30px;
  color: white;
  font-size: 12px;
  background-image: url("/public/img/mapServer/popBack.png");
  background: rgba(15, 27, 41, 0.8);
  .canvasImg {
    width: 12px;
    margin-left: 8px;
    margin-right: 4px;
  }
}
.off {
  color: white;
  // background-color: rgba(54, 61, 71, 0.76);
  // border-radius: 4px;
  display: inline-block;
  // width: 50px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  position: absolute;
  z-index: 10000;
  right: 5px;
  top: 10px;
  background-image: url("/public/img/mapServer/popOff.png");
  background-size: 50%;
  width: 20px;
  background-repeat: no-repeat;
}
canvas {
  width: 100%;
  height: 100%;
}
</style>
