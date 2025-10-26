import * as Cesium from "cesium";

import defaultImage from "../core/images/flicker.png";
let registerFlag = false;
export default class PolylineFlow {
  image;
  constructor(color, image, time) {
    //console.log("参数color, image, time", color, image, time);
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this.color = color;
    this.duration = time;
    this._time = new Date().getTime();
    this.image = image;
    if (registerFlag == false) {
      //只注册一次
      this.init();
      registerFlag = true;
    }
  }
  init() {
    Cesium.Material.PolylineTrailLinkType = "PolylineFlow";
    Cesium.Material.PolylineTrailLinkSource = `
      czm_material czm_getMaterial(czm_materialInput materialInput)
      {
         czm_material material = czm_getDefaultMaterial(materialInput);
         vec2 st = materialInput.st;
         vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
         material.alpha = colorImage.a * color.a;
         material.diffuse = (colorImage.rgb+color.rgb)/2.0;
         return material;
      }
    `;
    Cesium.Material._materialCache.addMaterial(
      Cesium.Material.PolylineTrailLinkType,
      {
        fabric: {
          type: Cesium.Material.PolylineTrailLinkType,
          uniforms: {
            color: new Cesium.Color(0.0, 0.0, 0.0, 0.5),
            image: defaultImage,
            time: 0,
          },
          source: Cesium.Material.PolylineTrailLinkSource,
        },
        translucent() {
          return true;
        },
      }
    );
  }

  getType() {
    return "PolylineFlow";
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = this.color._value;
    result.image = this.image;
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result;
  }

  equals(other) {
    // return (
    //   this === other ||
    //   (other instanceof PolylineFlow &&
    //     Cesium.Property.equals(this._color, other._color))
    // );
    return false;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }
}

Object.defineProperties(PolylineFlow.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
});
