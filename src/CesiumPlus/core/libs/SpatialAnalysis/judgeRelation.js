import * as Cesium from "cesium";
import * as turf from "@turf/turf";

export const judgeRelation = {
  /**
   * 判断点与面空间关系 (判断一个点是否在多边形内部)。
   * 该函数通过Turf.js库的地理空间分析函数来实现点与多边形的关系判断。
   * 主要用于地理信息系统（GIS）相关的应用中，判断某个点是否位于给定多边形区域内。
   *
   * @param {Array} point - 表示点的坐标数组，通常为[经度, 纬度]的形式。
   * @param {Array} polygon - 表示多边形的坐标数组，每个坐标数组代表一个环，外环为多边形的边界，内环为多边形内的孔。
   * @returns {boolean} - 如果点在多边形内部返回true，否则返回false。
   */
  judgePointAndPolygon(point, polygon) {
    var pt = turf.point(point);
    polygon.forEach((element) => {
      element.push(element[0]);
    });
    var poly = turf.polygon(polygon);
    let flagTemp = turf.booleanDisjoint(pt, poly);
    return !flagTemp;
  },
  /**
   * 判断线与面空间关系(判断线和多边形是否相交)
   * 该函数通过将传入的线和多边形转换为GeoJSON格式的几何对象，然后使用turf.js库的booleanDisjoint函数来判断这两个几何对象是否相交。
   * 如果它们不相交，函数返回true；如果相交，则返回false。
   *
   * @param polyline 一个表示线的坐标数组。每个坐标是一个数组，包含经度和纬度。
   * @param polygon 一个表示多边形的坐标数组。每个坐标是一个数组，包含经度和纬度。多边形的最后一个坐标应该是第一个坐标的重复，以形成一个封闭的多边形。
   * @returns 如果线和多边形不相交，返回true；如果相交，返回false。
   */
  judgePolylineAndPolygon(polyline, polygon) {
    var pl = turf.lineString(polyline);
    polygon.forEach((element) => {
      element.push(element[0]);
    });
    var poly = turf.polygon(polygon);
    let flagTemp = turf.booleanDisjoint(pl, poly);
    return !flagTemp;
  },
  /**
   * 判断面与面空间关系(判断两个多边形是否相交)
   * 本函数使用Turf.js库来处理地理空间分析中的多边形相交问题。
   * 它接受两个参数，每个参数代表一个多边形的坐标数组。
   * 多边形的每个坐标是一个数组，其中包含x和y坐标值。
   * 函数首先确保每个多边形的最后一个点是它的第一个点，这是Turf.js库的要求。
   * 然后，它使用turf.polygon函数将坐标数组转换为Turf.js的多边形对象。
   * 最后，它使用turf.booleanDisjoint函数检查这两个多边形是否不相交。
   * 如果多边形不相交，函数返回true；如果相交，则返回false。
   *
   * @param {Array<Array<Array<number>>>} polygon1 - 第一个多边形的坐标数组。
   * @param {Array<Array<Array<number>>>} polygon2 - 第二个多边形的坐标数组。
   * @returns {boolean} 如果多边形不相交返回true，否则返回false。
   */
  judgePolygonAndPolygon(polygon1, polygon2) {
    polygon1.forEach((element) => {
      element.push(element[0]);
    });
    var pg1 = turf.polygon(polygon1);

    polygon2.forEach((element) => {
      element.push(element[0]);
    });
    var pg2 = turf.polygon(polygon2);
    let flagTemp = turf.booleanDisjoint(pg1, pg2);
    return !flagTemp;
  },
};
