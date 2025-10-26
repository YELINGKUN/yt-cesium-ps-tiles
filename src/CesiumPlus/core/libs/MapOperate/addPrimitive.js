import * as Cesium from "cesium";

export const addPrimitive = {
  ffCesiumPointPrimitiveCollection: null, //大量点
  ffCesiumPrimitiveCollection: null, //大量线，面
  ffCesiumBillboardPrimitiveCollection: null, //大量广告牌
  ffCesiumGltfCollection: null, //大量模型
  /**
   * 初始化
   *
   *
   */
  addPrimitiveInit() {
    this.ffCesiumPointPrimitiveCollection = this.viewer.scene.primitives.add(
      new Cesium.PointPrimitiveCollection()
    );
    this.ffCesiumPrimitiveCollection = this.viewer.scene.primitives.add(
      new Cesium.PrimitiveCollection()
    );
    this.ffCesiumGltfCollection = this.viewer.scene.primitives.add(
      new Cesium.PrimitiveCollection()
    );
    this.ffCesiumBillboardPrimitiveCollection =
      this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
  },
  /**
   * 异步添加GLTF模型图元。
   * @param {Array} lngLatHeight - 经度、纬度、高度数组。
   * @param {Object} option - 模型的配置选项，包括URL、视角、最小像素大小、最大比例等。
   * @returns {Promise<Cesium.Model>} 返回一个Promise，解析为添加的模型图元对象。
   */
  async addGltfPrimitive(lngLatHeight, option) {
    const position = Cesium.Cartesian3.fromDegrees(
      lngLatHeight[0],
      lngLatHeight[1],
      lngLatHeight[2]
    );

    let heading = Cesium.Math.toRadians(option.headingAngle);
    let pitch = Cesium.Math.toRadians(option.pitchAngle);
    let roll = Cesium.Math.toRadians(option.rollAngle);
    let headingPositionRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    //const headingPositionRoll = new Cesium.HeadingPitchRoll();
    const fixedFrameTransform =
      Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");
    let newOption = Object.assign({}, option);
    let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      headingPositionRoll,
      Cesium.Ellipsoid.WGS84,
      fixedFrameTransform
    );
    newOption.modelMatrix = modelMatrix;
    console.log("newOption", newOption);
    try {
      const model = await Cesium.Model.fromGltfAsync(newOption);
      model.FFtype = "FFGltfPrimitive";
      this.ffCesiumGltfCollection.add(model);
      console.log("model", this.ffCesiumGltfCollection);
      return model;
    } catch (error) {
      console.log(`Failed to load model. ${error}`);
    }
  },

  /**
   * 添加广告牌图元。
   * @param {Array} lngLatHeight - 经度、纬度、高度数组。
   * @param {Object} option - 广告牌的配置选项，包括图片URL、像素偏移等。
   * @returns {Cesium.Billboard} 返回添加的广告牌图元对象。
   */
  addBillboardPrimitive(lngLatHeight, option) {
    let newOption = Object.assign({}, option);
    newOption.position = Cesium.Cartesian3.fromDegrees(
      lngLatHeight[0],
      lngLatHeight[1],
      lngLatHeight[2]
    );
    newOption.image = newOption.image;
    newOption.pixelOffset = new Cesium.Cartesian2(
      newOption.pixelOffset[0],
      newOption.pixelOffset[1]
    );
    let primitive = this.ffCesiumBillboardPrimitiveCollection.add(newOption);
    primitive.FFtype = "FFBillboardPrimitive";
    return primitive;
  },

  /**
   * 添加点图元。
   * @param {Array} lngLatHeight - 经度、纬度、高度数组。
   * @param {Object} option - 点的配置选项，包括颜色、透明度、轮廓线颜色等。
   * @returns {Cesium.PointPrimitive} 返回添加的点图元对象。
   */
  addPointPrimitive(lngLatHeight, option) {
    let newOption = Object.assign({}, option);
    //其他特殊参数设置
    newOption.position = Cesium.Cartesian3.fromDegrees(
      lngLatHeight[0],
      lngLatHeight[1],
      lngLatHeight[2]
    );

    //颜色属性设置
    newOption.color = new Cesium.Color.fromCssColorString(
      option.color
    ).withAlpha(option.alpha);

    if (option.outlineColor) {
      newOption.outlineColor = new Cesium.Color.fromCssColorString(
        option.outlineColor
      );
    }
    newOption.clampToGround = true;
    let primitive = this.ffCesiumPointPrimitiveCollection.add(newOption);
    primitive.FFtype = "FFPointPrimitive";
    return primitive;
  },
  /**
   * 添加线图元。
   * @param {Array} lnglatArr - 经度、纬度数组，包含线的各个点。
   * @param {Object} option - 线的配置选项，包括宽度、颜色、透明度等。
   * @returns {Cesium.Primitive} 返回添加的线图元对象。
   */
  addPolylinePrimitive(lnglatArr, option) {
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: option.width,
      }),
    });
    const primitive = new Cesium.Primitive({
      geometryInstances: instance, //可以是实例数组
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: new Cesium.Color.fromCssColorString(
                option.color
              ).withAlpha(option.alpha),
            },
          },
        }),
      }),
    });
    this.ffCesiumPrimitiveCollection.add(primitive);
    primitive.FFtype = "FFPolylinePrimitive";
    return primitive;
  },
  /**
   * 添加面图元。
   * @param {Array} lnglatArr - 经度、纬度数组，包含面的各个点。
   * @param {Object} option - 面的配置选项，包括颜色、透明度等。
   * @returns {Cesium.Primitive} 返回添加的面图元对象。
   */
  addPolygonPrimitive(lnglatArr, option) {
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat())
        ),
      }),
      extrudedHeight: 300000,
    });
    console.log("zzzzz");
    const primitive = new Cesium.Primitive({
      geometryInstances: instance, //可以是实例数组
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: new Cesium.Color.fromCssColorString(
                option.color
              ).withAlpha(option.alpha),
            },
          },
        }),
      }),
    });
    this.ffCesiumPrimitiveCollection.add(primitive);
    primitive.FFtype = "FFPolygonPrimitive";
    return primitive;
  },
  /**
   * 删除原始图形Primitive
   * @param {Object} FFPrimitive - 要移除的FFPrimitive对象，它有一个FFtype属性来指示其类型。
   */
  removeFFPrimitive(FFPrimitive) {
    console.log("removeFFPrimitive--FFPrimitive", FFPrimitive);
    if (FFPrimitive.FFtype) {
      if (FFPrimitive.FFtype == "FFPointPrimitive") {
        this.ffCesiumPointPrimitiveCollection.remove(FFPrimitive);
      } else if (FFPrimitive.FFtype == "FFBillboardPrimitive") {
        this.ffCesiumBillboardPrimitiveCollection.remove(FFPrimitive);
      } else if (FFPrimitive.FFtype == "FFGltfPrimitive") {
        this.ffCesiumGltfCollection.remove(FFPrimitive);
      } else if (
        FFPrimitive.FFtype == "FFPolylinePrimitive" ||
        FFPrimitive.FFtype == "FFPolygonPrimitive"
      ) {
        this.ffCesiumPrimitiveCollection.remove(FFPrimitive);
      }
    }
  },
};
