import * as Cesium from "cesium";
import massifData from "../data/massif.json";
class PolygonEffect {
  ffCesium;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  /**
   * 叠加地块
   */
  addMassif() {
    console.log("massifData", massifData);
    for (let i = 0; i < massifData.features.length; i++) {
      //console.log(" massifData.features[i]", massifData.features[i]);
      if (massifData.features[i].geometry) {
        let zbcArr = massifData.features[i].geometry.coordinates[0];
        let color = this.getColor(massifData.features[i]);
        let polygonEntity = this.ffCesium.viewer.entities.add({
          polygon: {
            hierarchy: {
              positions: Cesium.Cartesian3.fromDegreesArray(zbcArr.flat()),
            },
            material: Cesium.Color.fromCssColorString(color).withAlpha(0.8),
          },
        });
      }
    }
  }
  getColor(feature) {
    let color = "";
    if (feature.properties.type == "小麦") {
      color = "#597ef7";
    } else if (feature.properties.type == "花生") {
      color = "#8ba5f9";
    } else if (feature.properties.type == "水稻") {
      color = "#cdd8fd";
    } else if (feature.properties.type == "甜菜") {
      color = "#acbffb";
    } else if (feature.properties.type == "玉米") {
      color = "#6a8bf8";
    } else if (feature.properties.type == "棉花") {
      color = "#435fb9";
    } else if (feature.properties.type == "大豆") {
      color = "#28396f";
    } else if (feature.properties.type == "谷子") {
      color = "#1b264a";
    } else {
      console.log("feature.properties.type", feature.properties.type);
      color = "#FFFFFF";
    }
    return color;
  }

  addLabel(polygonArr) {
    for (let i = 0; i < polygonArr.length; i++) {
      var label = this.ffCesium.viewer.entities.add({
        // 位置
        position: Cesium.Cartesian3.fromDegrees(
          polygonArr[i][0],
          polygonArr[i][1]
        ),
        // 实体类型
        label: {
          // 文本
          text: polygonArr[i][0] + "," + polygonArr[i][1],
          // 样式
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          // 字体
          font: "12px monospace",
          // 文本边界的宽度
          outlineWidth: 5,
          pixelOffset: new Cesium.Cartesian2(-100, -110),
        },
      });
    }
  }
}

export default PolygonEffect;
