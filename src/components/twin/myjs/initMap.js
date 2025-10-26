import FFCesium from "../FFCesium/core/index.js";
export function initMap() {
  let viewerOption = {
    animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/2D选择器
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: false, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    shadows: true, //是否显示背影
    shouldAnimate: true,
    baseLayer: false,
    orderIndependentTranslucency: true,
    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  };
  let ffCesium = new FFCesium("cesiumContainer", viewerOption);
  //加载地形

  ffCesium.addTerrain("http://data.marsgis.cn/terrain");
  //ffCesium.addTerrain("http://112.48.26.30:24518/gis-mapServer/JMSDX/");

  //叠加地图
  //ffCesium.addTdtImgLayer();
  ffCesium.addArcgisImgLayer();

  // let url = "http://khms0.google.com/kh/v=984?x={x}&y={y}&z={z}";
  // ffCesium.addCustomLayer(url);

  //

  //调整亮度和gamma值
  //ffCesium.viewer.imageryLayers.get(0).gamma = 0.8;
  //ffCesium.viewer.imageryLayers.get(0).brightness = 1.5;

  // 设置底图半透明度-start
  /** 
  ffCesium.viewer.imageryLayers.get(0).alpha = 0.9; // 设置半透明度为50%
  let viewer = ffCesium.viewer;
  let Cesium = ffCesium.Cesium;
  // 设置地图透明
  viewer.scene.skyBox.show = false; // 屏蔽天空盒
  // 设置背景透明
  viewer.scene.globe.translucency.backFaceAlpha = 0.9; // 应用于地球背面的恒定半透明度
  viewer.scene.skyBox.show = false; //去掉天空盒子
  viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0); // 地球半透明表面
  viewer.scene.globe.translucency.enabled = true; //设置场景背景色透明，便于显示自定的背景
  // 禁用地下着色
  viewer.scene.globe.undergroundColor = undefined;
  // 地球上地面大气
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
  viewer.scene.globe.enableLighting = false; //隐藏太阳
  viewer.shadows = false;
  viewer.scene.sun.show = false; //还可以viewer.scene.sun.destroy();
  viewer.scene.moon.show = false; //月亮
  viewer.scene.skyAtmosphere.show = false; //大气
  // 设置底图半透明度-end
  */

  //ffCesium.viewer.imageryLayers.get(0).brightness = 1.5;
  //启用地形监测
  https: ffCesium.viewer.scene.globe.depthTestAgainstTerrain = true;
  //启用抗锯齿
  ffCesium.viewer.scene.postProcessStages.fxaa.enabled = true;
  //初始定位
  ffCesium.setView({
    lng: 130.15461155821515,
    lat: 46.02925403799818,
    height: 115000,
    pitchRadiu: -52,
  });

  /*********tmj Start 2024-08-21****************/
  /*
  //整个场景泛光效果
  var viewModel = {
    show: true,
    glowOnly: false,
    contrast: 220,
    brightness: 0.1,
    delta: -2.0,
    sigma: 1.0,
    stepSize: 15.0,
  };
  var bloom = ffCesium.viewer.scene.postProcessStages.bloom;
  bloom.enabled = false;
  bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly);
  bloom.uniforms.contrast = Number(viewModel.contrast);
  bloom.uniforms.brightness = Number(viewModel.brightness);
  bloom.uniforms.delta = Number(viewModel.delta);
  bloom.uniforms.sigma = Number(viewModel.sigma);
  bloom.uniforms.stepSize = Number(viewModel.stepSize);
  //地形拉升
  //ffCesium.viewer.scene.verticalExaggeration = 5.0;
  */
  /*********tmj End 2024-08-21****************/

  return ffCesium;
}

export function destroyMap(ffCesium) {
  // 清除全部实体
  ffCesium.viewer.entities.values.forEach((entity, index) => {
    ffCesium.viewer.entities.remove(entity);
  });
  // 删除底图
  ffCesium.viewer.imageryLayers.removeAll();
  // 删除边界
  ffCesium.viewer.dataSources.removeAll();
  // 删除上下文
  let gl = ffCesium.viewer.scene.context._originalGLContext;
  gl.canvas.width = 1;
  gl.canvas.height = 1;
  ffCesium.viewer.destroy(); // 销毁Viewer实例
  gl.getExtension("WEBGL_lose_context").loseContext();
  gl = null;

  if (ffCesium.viewer) {
    ffCesium.viewer = null;
  }
}
