export function getLngLatArrFromLngLatHeightArr(LngLatHeightArr) {
  let lngLatArr = [];
  LngLatHeightArr.forEach((element) => {
    let arrTemp = [];
    arrTemp.push(element[0]);
    arrTemp.push(element[1]);
    lngLatArr.push(arrTemp);
  });
  return lngLatArr;
}

/**
 * 获取当前相机中心点
 * @param {*} ffCesium
 */
export function getCenterPosition(ffCesium) {
  let viewer = ffCesium.viewer;
  let centerResult = viewer.camera.pickEllipsoid(
    new ffCesium.Cesium.Cartesian2(
      viewer.canvas.clientWidth / 2,
      viewer.canvas.clientHeight / 2
    )
  );
  if (centerResult) {
    let curPosition =
      ffCesium.Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
    let curLongitude = (curPosition.longitude * 180) / Math.PI;
    let curLatitude = (curPosition.latitude * 180) / Math.PI;
    return {
      lon: curLongitude,
      lat: curLatitude,
    };
  } else {
    return null;
  }
}
