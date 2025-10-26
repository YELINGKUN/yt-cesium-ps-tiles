import * as Cesium from "cesium";
//import h337 from "heatmap.js";
import CanvasHeightmap from "canvas-heightmap/src/CanvasHeightmap";

/**
 * @example
 * heatMapTool = new HeatMap(this.map)
 * heatMapTool.addHeatMap(jsonData, true)
 */
export class HeatMap {
  constructor(viewer) {
    this.viewer = viewer;
    this.heatLayer = new Cesium.CustomDataSource("heatlayer");
    this.viewer.dataSources.add(this.heatLayer);

    this.entity = null;
    this.primitive = null;
    this.heatMap = null;
    // 此处代码传入RGBA ， 没有设置normalize（专业名词归一化，白话就是映射 => 0 - 255 => 0.0 - 1.0）的情况，此处传入的colors 应是 浮点数。如（ 1.0, 0.0,0.0, 1.0） 表示透明度为1 的红色。指定Cesium 每4 个 数值读取为一个颜色
    this.colors = [];
    //indices 顶点索引。无需做缓冲处理，cesium内部已做处理，直接传入一维数组即可
    this.indices = [];
    this.sts = [];

    this.defaultOptions = {
      radius: 20,
      maxOpacity: 1,
      minOpacity: 0.05,
      gradient: {
        ".3": "blue",
        ".45": "green",
        ".65": "yellow",
        ".8": "orange",
        ".95": "red",
        // 0.1: "white",
        // 0.3: "green",
        // 0.5: "blue",
        // 0.7: "yellow",
        // 0.8: "orange",
        // 0.9: "red",
      },
    };
  }

  setOptions(p) {
    this.defaultOptions = Object.assign({}, this.defaultOptions, p);
  }

  getDefaultData(width, height) {
    var domElement = document.createElement("div");
    domElement.setAttribute(
      "style",
      "width: " +
        width +
        "px; height: " +
        height +
        "px; margin: 0px; display: none;"
    );
    document.body.appendChild(domElement);
    return Object.assign({}, this.defaultOptions, {
      container: domElement,
    });
  }

  /**
   * 二三维热力图
   * @param {*} geoJsonData geoJson数据
   * @param {*} valField  分值字段
   * @param {*} is3D 是否3D显示，默认true
   */
  addHeatMapForGeoJson(geoJsonData, valField, is3D = true) {
    let dataJson = [];
    let extent;

    let max = 100;

    //1、计算空间数据的范围边界
    var lonmin = 180;
    var lonmax = -180;
    var latmin = 90;
    var latmax = -90;
    // const data = geoJsonData;
    geoJsonData.features.forEach(function (feature) {
      var lon = feature.geometry.coordinates[0];
      var lat = feature.geometry.coordinates[1];
      lonmin = lon < lonmin ? lon : lonmin;
      latmin = lat < latmin ? lat : latmin;
      lonmax = lon > lonmax ? lon : lonmax;
      latmax = lat > latmax ? lat : latmax;
    });
    var xrange = lonmax - lonmin;
    var yrange = latmax - latmin;
    //扩展一点范围
    extent = {
      xMin: lonmin - xrange / 10,
      yMin: latmin - yrange / 10,
      xMax: lonmax + xrange / 10,
      yMax: latmax + yrange / 10,
    };

    //2、计算热力图的宽高大小
    var width = 1000;
    var height = parseInt(
      (1000 / (extent.xMax - extent.xMin)) * (extent.yMax - extent.yMin)
    );

    //3、基于经纬度计算热力图数据
    geoJsonData.features.forEach(function (feature) {
      var lon = feature.geometry.coordinates[0];
      var lat = feature.geometry.coordinates[1];
      const x = ((lon - extent.xMin) / (extent.xMax - extent.xMin)) * width;
      const y =
        (-(lat - extent.yMin) / (extent.yMax - extent.yMin) + 1) * height;
      const point = {
        x: parseInt(x),
        y: parseInt(y),
        value: feature.properties[valField],
      };
      dataJson.push(point);
    });

    // //定位到热力图范围
    // viewer.camera.flyTo({
    //   destination: Cesium.Rectangle.fromDegrees(
    //     extent.xMin,
    //     extent.yMin,
    //     extent.xMax,
    //     extent.yMax
    //   ),
    // });

    this.heatMap = h337.create(this.getDefaultData(width, height));

    this.bounds = {
      west: extent.xMin,
      south: extent.yMin,
      east: extent.xMax,
      north: extent.yMax,
    };

    this.heatMap.setData({
      // min: 0,
      max: max,
      data: dataJson,
    });

    this.addcanvas(this.bounds, is3D);
  }

  addcanvas(bounds, is3D = false) {
    if (is3D) {
      // 获取灰度图
      const canvas = this.getGrayMap(this.heatMap._renderer.canvas);
      // 绘制三维热力图
      this.getGrayValues(canvas);
      // //绘制边界矩形范围
      // this.entity = this.heatLayer.entities.add({
      //   name: "heatmap",
      //   rectangle: {
      //     coordinates: Cesium.Rectangle.fromDegrees(
      //       bounds[0],
      //       bounds[1],
      //       bounds[2],
      //       bounds[3]
      //     ),
      //     fill: false,
      //     outline: true,
      //     outlineColor: Cesium.Color.BLUE,
      //     outlineWidth: 5,
      //     extrudedHeight: 10,
      //   },
      //   clampToGround: true,
      // });
    } else {
      this.entity = this.heatLayer.entities.add({
        name: "heatmap",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(
            bounds[0],
            bounds[1],
            bounds[2],
            bounds[3]
          ),
          material: this.heatMap._renderer.canvas,
        },
        clampToGround: true,
      });
    }
  }

  // 图片转灰度图
  getGrayMap(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const c = ctx.getImageData(0, 0, img.width, img.height);
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        const x = j * 4 * c.width + i * 4;
        const r = c.data[x];
        const g = c.data[x + 1];
        const b = c.data[x + 2];
        this.colors.push(
          [r / 255, g / 255, b / 255, 1],
          [r / 255, g / 255, b / 255, 1]
        );
        const gray = 240 - this.rgbtohsl(r, g, b)[0];
        c.data[x] = c.data[x + 1] = c.data[x + 2] = gray;
      }
    }
    ctx.putImageData(c, 0, 0, 0, 0, c.width, c.height);
    return canvas.toDataURL();
  }

  rgbtohsl(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    let l = (min + max) / 2;
    const difference = max - min;
    let h, s;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min);
      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0);
          break;
        case g:
          h = 2.0 + (b - r) / difference;
          break;
        case b:
          h = 4.0 + (r - g) / difference;
          break;
      }
      h = Math.round(h * 60);
    }

    s = Math.round(s * 100); //转换成百分比的形式
    l = Math.round(l * 100);
    return [h, s, 1];
  }

  /**
   * 灰度转出来是一维数组，转为rgba四通道
   *
   * @param img 图像对象
   * @returns 无返回值
   */
  getGrayValues(img) {
    const ch = new CanvasHeightmap();
    ch.use(img)
      .then(() => {
        ch.draw();
        return ch.getRgbaArray();
      })
      .then((data) => {
        this.createTerrain(data);
      });
  }

  createTerrain(data) {
    //3D 位置属性。
    // 64 位浮点（用于精度）。每个属性 3 个组件。
    const realPos = this.getPos(data, this.bounds);
    const instance = this.createGeometry(realPos);
    this.addGeometry(instance);
  }

  addGeometry(instance) {
    this.primitive = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.Appearance({
          material: new Cesium.Material({
            fabric: {
              uniforms: {
                image: this.heatMap._renderer.canvas.toDataURL(),
              },
              source: this.getMS(),
            },
          }),
          aboveGround: true,
          faceForward: true,
          flat: true,
          translucent: false,
          renderState: {
            blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
            depthTest: {
              enabled: true,
            },
            depthMask: true,
          },
          fragmentShaderSource: this.getFS(),
          vertexShaderSource: this.getVS(),
        }),
        asynchronous: false,
      })
    );
  }

  createPolygon(positions) {
    this.polygon = this.viewer.entities.add({
      name: "heatentity",
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positions),
        outline: true,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 5,
      },
    });
    // this.viewer.zoomTo(this.polygon)
  }

  /**
   * 通过3中的坐标创建三角网
   * @param {*} realPos
   * @returns
   */
  createGeometry(realPos) {
    const attributes = new Cesium.GeometryAttributes({
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(realPos),
      }),
      st: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: new Float32Array(this.sts),
      }),
    });
    const boundingSphere = Cesium.BoundingSphere.fromVertices(
      realPos,
      new Cesium.Cartesian3(0.0, 0.0, 0.0),
      3
    );
    const geometry = new Cesium.Geometry({
      attributes: attributes,
      indices: this.indices,
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: boundingSphere,
    });
    return new Cesium.GeometryInstance({ geometry });
    //无填充
    // return new Cesium.GeometryInstance({
    //   geometry: Cesium.GeometryPipeline.toWireframe(geometry),
    // });
  }

  /**
   * 将整个canvas划分，获取每个顶点的坐标值（经纬度+通过2中得到的高度）
   * @param {*} rgbaArray
   * @param {*} bounds
   * @returns
   */
  getPos(rgbaArray, bounds) {
    const arr = [];
    const row = rgbaArray.length;
    const col = rgbaArray[0].length;
    const everyLon = (bounds.east - bounds.west) / col;
    const everyLat = (bounds.north - bounds.south) / row;
    for (let i = 0; i <= row; i++) {
      for (let j = 0; j <= col; j++) {
        if (
          (i * col + j + 1) % (col + 1) !== 0 &&
          i * col + j < (col + 1) * row
        ) {
          this.indices.push(
            i * col + j,
            i * col + j + 1,
            i * col + j + 1 + col + 1,
            i * col + j + 1 + col + 1,
            i * col + j,
            i * col + j + col + 1
          );
        }

        const lon1 = bounds.west + j * everyLon;
        const lat1 = bounds.north - i * everyLat;
        // let height1 = rgbaArray[i][j][0]
        let height1 = parseFloat(this.getHeight(i, j, col, row, rgbaArray));
        const position = Cesium.Cartesian3.fromDegrees(lon1, lat1, height1);
        arr.push(position.x, position.y, position.z);
        // 2D 纹理坐标属性。
        // 32 位浮点数。每个属性 2 个组件
        this.sts.push(j / rgbaArray[0].length, 1 - i / rgbaArray.length);
      }
    }
    return arr;
  }

  getHeight(i, j, col, row, rgbaArray) {
    let height1;
    if (i === 0 && j === 0) {
      height1 = rgbaArray[i][j][0];
    }
    if (i === 0 && j !== 0 && j !== col) {
      height1 = (rgbaArray[i][j][0] + rgbaArray[i][j - 1][0]) / 2;
    }
    if (i === 0 && j === col) {
      height1 = rgbaArray[i][j - 1][0];
    }
    if (i !== 0 && i !== row && j === 0) {
      height1 = (rgbaArray[i][j][0] + rgbaArray[i - 1][j][0]) / 2;
    }
    if (i !== 0 && i !== row && j !== 0 && j !== col) {
      height1 =
        (rgbaArray[i][j][0] +
          rgbaArray[i - 1][j][0] +
          rgbaArray[i - 1][j - 1][0] +
          rgbaArray[i][j - 1][0]) /
        4;
    }
    if (i !== 0 && i !== row && j === col) {
      height1 = (rgbaArray[i - 1][j - 1][0] + rgbaArray[i][j - 1][0]) / 2;
    }
    if (i !== 0 && i !== row && j !== 0 && j !== col) {
      height1 =
        (rgbaArray[i][j][0] +
          rgbaArray[i - 1][j][0] +
          rgbaArray[i - 1][j - 1][0] +
          rgbaArray[i][j - 1][0]) /
        4;
    }
    if (i !== 0 && i !== row && j === col) {
      height1 = (rgbaArray[i - 1][j - 1][0] + rgbaArray[i][j - 1][0]) / 2;
    }
    if (i === row && j === 0) {
      height1 = rgbaArray[i - 1][j][0];
    }
    if (i === row && j !== 0 && j !== col) {
      height1 = (rgbaArray[i - 1][j][0] + rgbaArray[i - 1][j - 1][0]) / 2;
    }
    if (i === row && j === col) {
      height1 = rgbaArray[i - 1][j - 1][0];
    }
    return height1;
  }

  remove() {
    if (this.entity) this.heatLayer.entities.remove(this.entity);
    if (this.primitive) this.viewer.scene.primitives.remove(this.primitive);
    this.entity = null;
    this.primitive = null;
    this.heatMap = null;
    this.colors = [];
    this.indices = [];
    this.sts = [];
  }

  destroy() {
    this.remove();
    this.viewer.dataSources.remove(this.heatLayer);
    //this.viewer.dataSources.removeAll();
  }

  getVS() {
    return `in vec3 position3DHigh;
        in vec3 position3DLow;
        in vec2 st;
        in float batchId;
        out vec2 v_st;
        void main()
        {
        vec4 p=czm_computePosition();
        v_st=st;
        p= czm_modelViewProjectionRelativeToEye *p;
        gl_Position = p;
        }
        `;
  }
  getFS() {
    return `
        in vec2 v_st;
        void main()
        {
            czm_materialInput materialInput;
            czm_material material=czm_getMaterial(materialInput,v_st);
            vec4 color=vec4(material.diffuse + material.emission,material.alpha);
            if(color.x==1.0&&color.y==1.0&&color.z==1.0&&color.w==1.0) color=vec4(vec3(0.0,0.0,0.0),0.0);
            out_FragColor =color;
        }\
        `;
  }
  getMS() {
    return `czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
        {\
            vec4 color = texture(image, v_st);\
            czm_material material = czm_getDefaultMaterial(materialInput);\
            material.diffuse= color.rgb;\
            material.alpha=color.a;\
            return material;\
        }\
       `;
  }
}
