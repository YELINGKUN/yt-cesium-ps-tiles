import * as Cesium from "cesium";

export const addOtherElement = {
  /**
   * 在地图上添加HTML
   * @param {Array} lngLatHeight - 经纬度高度数组，
   * @param {string} html - 覆盖物的HTML内容。
   * @param {Object} offset - 覆盖物的偏移量对象，用于调整覆盖物在地图上的位置。
   * @returns {HTMLElement} 创建的HTML覆盖物元素。
   */
  addHtml(lngLatHeight, html, offset) {
    let htmlOverlay = document.createElement("div");
    htmlOverlay.style.zIndex = 9999;
    htmlOverlay.style.position = "absolute";
    htmlOverlay.style.display = "none";
    htmlOverlay.innerHTML = html;
    document.getElementById(this.cesiumID).appendChild(htmlOverlay);

    var scratch = new Cesium.Cartesian2();
    let the = this;
    this.viewer.scene.preRender.addEventListener(function () {
      var position = Cesium.Cartesian3.fromDegrees(
        lngLatHeight[0],
        lngLatHeight[1],
        lngLatHeight[2]
      );
      var canvasPosition = the.viewer.scene.cartesianToCanvasCoordinates(
        position,
        scratch
      );
      if (Cesium.defined(canvasPosition)) {
        let top = htmlOverlay.offsetHeight + offset.top;
        let left = htmlOverlay.offsetWidth / 2 + offset.left;
        htmlOverlay.style.top = canvasPosition.y - top + "px";
        htmlOverlay.style.left = canvasPosition.x - left + "px";
      } else {
      }
      if (htmlOverlay.style.display == "none") {
        window.setTimeout(() => {
          htmlOverlay.style.display = "block";
        }, 50);
      }
    });
    return htmlOverlay;
  },
  /**
   * 移除HTML覆盖元素
   * 该函数用于从具有特定cesiumID的元素中移除指定的HTML覆盖元素。
   * 这是处理UI交互或更新界面时常见的操作，可以保持DOM结构的清洁和性能。
   *
   * @param {HTMLElement} htmlOverlay - 要移除的HTML覆盖元素。这是一个DOM元素，它通过JavaScript操作被添加到页面上，现在需要被移除。
   */
  removeHtml(htmlOverlay) {
    document.getElementById(this.cesiumID).removeChild(htmlOverlay);
  },
};
