import * as Cesium from "cesium";
class palyLineFlow {
  ffCesium;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  addline(pointArr) {
    // let arrays = Cesium.Cartesian3.fromDegreesArrayHeights([
    //   129.91166208487124, 46.67457923051859, 300, 129.8999891112384,
    //   46.67387252225845, 30, 129.90033243399233, 46.68564978671208, 30,
    // ]);
    let arrays = Cesium.Cartesian3.fromDegreesArrayHeights(pointArr);
    const geometryline = new Cesium.PolylineGeometry({
      positions: arrays,
      width: 60,
    });
    let randoms = Math.random();
    const geometryInstance = new Cesium.GeometryInstance({
      geometry: geometryline,
      id: "4454",
    });

    let line = new Cesium.Primitive({
      geometryInstances: geometryInstance, // 多个instance组成的集合
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: Cesium.Material.PolylineGlowType,
            uniforms: {
              color: new Cesium.Color(0.0, 1.0, 1.0),
              glowPower: 0.1,
            },
            //   source: `
            //   uniform vec4 color;
            //   uniform float glowPower;
            //   in vec2 v_texCoord; // For handling texture coordinates
            //   out vec4 fragColor;

            //   void main() {
            //     float glow = smoothstep(0.0, glowPower, length(gl_FragCoord.xy - vec2(0.5, 0.5)));
            //     fragColor = color * glow;
            //   }
            // `,
          },
        }),
      }),
    });
    this.ffCesium.viewer.scene.primitives.add(line);
    return line;
  }
  // addlineFlowImg() {
  //   console.log("addline", this.ffCesium);
  //   let arrays = Cesium.Cartesian3.fromDegreesArrayHeights([
  //     129.91166208487124, 46.67457923051859, 300, 129.8999891112384,
  //     46.67387252225845, 30, 129.90033243399233, 46.68564978671208, 30,
  //   ]);
  //   const geometryline = new Cesium.PolylineGeometry({
  //     positions: arrays,
  //     width: 22,
  //   });
  //   let randoms = Math.random();
  //   const geometryInstance = new Cesium.GeometryInstance({
  //     geometry: geometryline,
  //     id: "4454",
  //     //   id: `id${randoms}`,
  //   });

  //   let line = new Cesium.Primitive({
  //     geometryInstances: geometryInstance, // 多个instance组成的集合
  //     // appearance: maps.PolylineMaterialAppearance('../../../public/img/dd.png', new Cesium.Color(1.0, 1.0, 1.0, 1))
  //     appearance: new Cesium.PolylineMaterialAppearance({
  //       // material: materialall.materialimg6('../../../public/img/111.png',-5,1)
  //       material: new Cesium.Material({
  //         fabric: {
  //           uniforms: {
  //             color: new Cesium.Color(0.0, 1.0, 1.0),
  //             image: "/public/img/mapServer/Alllogo.png",
  //             speed: 10,
  //           },
  //           source: `czm_material czm_getMaterial(czm_materialInput materialInput)
  //               {
  //                  czm_material material = czm_getDefaultMaterial(materialInput);
  //                  vec2 st = materialInput.st;
  //                  vec4 colorImage = texture2D(image, vec2(fract((st.s - speed * czm_frameNumber * 0.001)), st.t));
  //                  material.alpha = colorImage.a * color.a;
  //                  material.diffuse = color.rgb;
  //                  return material;
  //               }`,
  //         },
  //       }),
  //     }),
  //   });
  //   console.log("linelineline", line);
  //   // console.log("this.ffCesium.viewer", this.ffCesium.viewer);
  //   // this.ffCesium.viewer.scene.primitives.add(line);
  //   return line;
  // }
  // addlineflow() {
  //   console.log("addline", this.ffCesium);
  //   let arrays = Cesium.Cartesian3.fromDegreesArrayHeights([
  //     129.91166208487124, 46.67457923051859, 300, 129.8999891112384,
  //     46.67387252225845, 30, 129.90033243399233, 46.68564978671208, 30,
  //   ]);
  //   const geometryline = new Cesium.PolylineGeometry({
  //     positions: arrays,
  //     width: 60,
  //   });
  //   let randoms = Math.random();
  //   const geometryInstance = new Cesium.GeometryInstance({
  //     geometry: geometryline,
  //     id: "4454",
  //     //   id: `id${randoms}`,
  //   });

  //   let line = new Cesium.Primitive({
  //     geometryInstances: geometryInstance, // 多个instance组成的集合
  //     // appearance: maps.PolylineMaterialAppearance('../../../public/img/dd.png', new Cesium.Color(1.0, 1.0, 1.0, 1))
  //     appearance: new Cesium.PolylineMaterialAppearance({
  //       // material: materialall.materialimg6('../../../public/img/111.png',-5,1)
  //       // material: polylinematerial.Polylineimgflow(
  //       //   "../../../public/img/dd.png",
  //       //   new Cesium.Color(1.0, 1.0, 1.0)
  //       // ),
  //       material: new Cesium.Material({
  //         fabric: {
  //           type: Cesium.Material.PolylineGlowType,
  //           uniforms: {
  //             // color,
  //             color: new Cesium.Color(0.0, 1.0, 1.0),
  //             //   color: Cesium.Color.fromCssColorString("#0000ff"),
  //             alpha: 1.0,
  //             speep: 60.0,
  //           },
  //           source: `
  //                 czm_material czm_getMaterial(czm_materialInput materialInput){
  //                     czm_material material=czm_getDefaultMaterial(materialInput);
  //                     material.diffuse = color.rgb;
  //                     float animation =(czm_frameNumber/speep);
  //                     material.alpha=mod(1.0+materialInput.st.s-animation,alpha);
  //                     // material.specular = 1.0;
  //                     // material.shininess = 0.8;
  //                     material.emission = vec3(0.0, 0.0, 2.0);
  //                     return material;
  //                 }
  //                 `,
  //         },
  //       }),
  //     }),
  //   });
  //   console.log("linelineline", line);
  //   // console.log("this.ffCesium.viewer", this.ffCesium.viewer);
  //   // this.ffCesium.viewer.scene.primitives.add(line);
  //   return line;
  // }
}
export default palyLineFlow;
