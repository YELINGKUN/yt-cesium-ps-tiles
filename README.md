# hotMap.js 三维热力图说明

1、安装依赖项

<p>"axios": "^1.7.2",</p>
<p>"canvas-heightmap": "^1.0.7",</p>
<p>"heatmap.js": "^2.0.5",</p>

<p>注意：1、heatmap.js 依赖项安装方法：npm install heatmap.js，安装完成后，在node_modules文件夹下找到node_modules\heatmap.js\build\heatmap.js，注释掉527行的 // img.data = imgData; 
2、注释掉node_modules\.vite\deps\heatmap__js.js下的 // img.data = imgData;

</p>
2、调用方法

```

//旱情热力图相关
import hqData from "./data/hqjcd.json";
import { HeatMap } from "./myjs/hotMap.js";
let hotMap;
if (hotMap == null) {
    //创建热力图
    hotMap = new HeatMap(ffCesium.viewer);
    hotMap.addHeatMapForGeoJson(hqData, "value", true);
  }
  else {
    hotMap.destroy();//销毁热力图
    hotMap = null;
  }
```

3、示例数据

```
{
"type": "FeatureCollection",
"name": "旱情测试点",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
  { "type": "Feature", "properties": { "value": 10 }, "geometry": { "type": "Point", "coordinates": [ 129.796612699012172, 46.772413655773036 ] } },
  { "type": "Feature", "properties": { "value": 30 }, "geometry": { "type": "Point", "coordinates": [ 129.82132387169105, 46.746522702594689 ] } },
  { "type": "Feature", "properties": { "value": 70 }, "geometry": { "type": "Point", "coordinates": [ 129.851849437941439, 46.794311668218512 ] } }
]
}
```
