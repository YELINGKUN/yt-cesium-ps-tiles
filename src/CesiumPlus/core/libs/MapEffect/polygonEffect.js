import * as Cesium from "cesium";

export const polygonEffect = {
  /**
   * 添加水表面效果。
   * @param {Array} lnglatArr - 经纬度数组，用于创建多边形的边界。
   * @param {Object} option - 包含水表面效果选项的对象，如图像源、频率、动画速度和振幅。
   * @returns {Object} 返回添加的多边形原始对象。
   */
  addWaterSurfaceEffect(lnglatArr, option) {
    let polygonPrimitive = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat())
            ),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          }),
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: true,
          material: new Cesium.Material({
            fabric: {
              type: "Water",
              uniforms: {
                normalMap: Cesium.buildModuleUrl(option.image),
                frequency: option.frequency, //频率
                animationSpeed: option.animationSpeed, //动画速度
                amplitude: option.amplitude, //振幅
              },
            },
          }),
        }),
        show: true,
      })
    );
    return polygonPrimitive;
  },
  /**
   * 移除水表面效果。
   * @param {Object} polygonPrimitive - 要移除的多边形原始对象。
   */
  removeWaterSurfaceEffect(polygonPrimitive) {
    this.viewer.scene.primitives.remove(polygonPrimitive);
  },
};
