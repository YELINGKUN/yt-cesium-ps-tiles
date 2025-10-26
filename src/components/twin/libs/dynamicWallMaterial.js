import * as Cesium from "cesium";

/**
 * color（颜色）：颜色
 * speed（速度）：越低越快
 * count（条数）：分隔条数
 * freely（纵横）：vertical纵，cross横
 * direction（方向）：
 *    纵：'-'（由下到上），'+'（由上到下）
 *    横：'-'（顺时针），'+'（逆时针）
 */
export function DynamicWallMaterialProperty(
  color,
  speed,
  count,
  freely,
  direction,
  img
) {
  this._definitionChanged = new Cesium.Event();
  this.color = color;
  this.speed = speed;
  this.count = count;
  this.freely = freely;
  this.direction = direction;
  this.img = img;
  DynamicWallMaterialProperty.prototype.init(
    color,
    speed,
    count,
    freely,
    direction,
    img
  );
}

Object.defineProperties(DynamicWallMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
});

DynamicWallMaterialProperty.prototype.getType = function (time) {
  return "DynamicWall";
};
DynamicWallMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  //console.log(" this.color1", this.color);
  result.color = this.color;
  result.speed = this.speed;
  result.count = this.count;
  result.freely = this.freely;
  result.direction = this.direction;
  result.img = this.img;
  return result;
};
DynamicWallMaterialProperty.prototype.equals = function (other) {
  return false;
  //return this === other || (other instanceof DynamicWallMaterialProperty && Cesium.Property.equals(this._color, other._color));
};

DynamicWallMaterialProperty.prototype.init = function (
  color,
  speed,
  count,
  freely,
  direction,
  img
) {
  var sourceStr =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n";
  sourceStr += "{\n";
  sourceStr += "float time = czm_frameNumber / " + speed + ";\n";
  sourceStr +=
    "czm_material material = czm_getDefaultMaterial(materialInput);\n";
  sourceStr += "vec2 st = materialInput.st;\n";
  if (freely == "vertical") {
    //（由下到上）
    sourceStr =
      sourceStr +
      "vec4 colorImage = texture(image, vec2(fract( " +
      count +
      "*st.t " +
      direction +
      " time), fract(st.s)));\n ";
  } else {
    //（逆时针）
    sourceStr =
      sourceStr +
      "vec4 colorImage = texture(image, vec2(fract( " +
      count +
      "*st.s " +
      direction +
      " time), fract(st.t)));\n ";
  }
  sourceStr += "material.diffuse = color.rgb;\n ";
  sourceStr += "material.alpha = colorImage.a * color.a;\n ";
  sourceStr += "return material;\n";
  sourceStr += "}\n";
  console.log("sourceStr", sourceStr);
  console.log("参数:", color, speed, count, freely, direction);
  var uniforms = {
    color: color,
    image: img,
  };
  Cesium.Material._materialCache.addMaterial("DynamicWall", {
    fabric: {
      type: "DynamicWall",
      uniforms: uniforms,
      source: sourceStr,
    },
    translucent: true,
  });
};
