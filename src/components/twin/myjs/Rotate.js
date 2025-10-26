import * as Cesium from "cesium";
//地图类型
class Rotate {
  ffCesium;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  StopRotate() {
    this.ffCesium.viewer.clock.stopTime =
      this.ffCesium.viewer.clock.startTime.clone();
  }
  StartRotate() {
    let viewer = this.ffCesium.viewer;
    let Cesium = this.ffCesium.Cesium;
    //获取地图中心点
    var result = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        viewer.canvas.clientWidth / 2,
        viewer.canvas.clientHeight / 2
      )
    );
    var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
    var lng = (curPosition.longitude * 180) / Math.PI;
    var lat = (curPosition.latitude * 180) / Math.PI;
    //获取地图中心点的地形高度
    var carto = new Cesium.Cartographic.fromDegrees(lng, lat);
    var height = viewer.scene.globe.getHeight(carto);
    console.log("地形高度：" + height + "米");
    //获取距离中心点视角高度
    //var altiTemp=viewer.camera.positionCartographic.height;

    /**
  
          var start = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
          var end = Cesium.Cartographic.fromDegrees(lng,lat,0)
          var geodesic = new Cesium.EllipsoidGeodesic();
          geodesic.setEndPoints(start, end);
          var distance = geodesic.surfaceDistance;
  
          */
    //两点的直线距离
    var startPosition = viewer.camera.position;
    var endPosition = result;
    console.log("startPosition,endPosition", startPosition, endPosition);
    var distance = Cesium.Cartesian3.distance(startPosition, endPosition);
    console.log("距离中心点视角高度1：" + distance + "米");

    //获取倾斜角度
    var viewerPitch = Cesium.Math.toDegrees(viewer.camera.pitch);
    console.log("倾斜角度", viewerPitch);

    var options = {
      lng: lng,
      lat: lat,
      height: height,
      heading: 0.0,
      pitch: viewerPitch,
      roll: 0.0,
    };
    console.log("options", options);
    var position = Cesium.Cartesian3.fromDegrees(
      options.lng,
      options.lat,
      options.height
    );
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
    var pitch = Cesium.Math.toRadians(viewerPitch);
    // 给定飞行一周所需时间，比如20s, 那么每秒转动度数
    var angle = -360 / 20; //每秒转动角度,该设置需要转动20秒才一周
    // 给定相机距离点多少距离飞行，这里取值为5000m
    var distance = distance;
    var startTime = Cesium.JulianDate.fromDate(new Date());

    //只旋转10秒
    var stopTime = Cesium.JulianDate.addSeconds(
      startTime,
      20,
      new Cesium.JulianDate()
    );
    viewer.clock.stopTime = stopTime.clone(); // 结速时间

    viewer.clock.startTime = startTime.clone(); // 开始时间
    viewer.clock.currentTime = startTime.clone(); // 当前时间
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    var initialHeading = viewer.camera.heading;
    var Exection = function TimeExecution() {
      // 当前已经过去的时间，单位s
      var delTime = Cesium.JulianDate.secondsDifference(
        viewer.clock.currentTime,
        viewer.clock.startTime
      );
      var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
      viewer.scene.camera.setView({
        destination: position, // 点的坐标
        orientation: {
          heading: heading,
          pitch: pitch,
        },
      });
      viewer.scene.camera.moveBackward(distance);
      //console.log("viewer.clock.currentTime",viewer.clock.currentTime);
      //console.log("viewer.clock.stopTime:",viewer.clock.stopTime);
      if (
        Cesium.JulianDate.compare(
          viewer.clock.currentTime,
          viewer.clock.stopTime
        ) >= 0
      ) {
        viewer.clock.onTick.removeEventListener(Exection);
      }
    };
    viewer.clock.onTick.addEventListener(Exection);
  }
}
export default Rotate;
