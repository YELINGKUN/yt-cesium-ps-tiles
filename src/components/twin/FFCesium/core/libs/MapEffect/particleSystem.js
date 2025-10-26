import * as Cesium from "cesium";

import { myParticleSystem } from "../../../dependentLib/myParticleSystem.js";

export const particleSystem = {
  ffCesiumCloudCollection: null, //大量云朵
  /**
   * 初始化并添加云朵效果到Cesium的场景中。
   * 如果云朵集合尚未创建，则先创建一个云朵集合对象，并添加到场景中。
   * 接着，根据提供的选项添加一个新的云朵实体到云朵集合中。
   *
   * @param {Object} option 添加云朵所需的配置选项，包括：
   *   lng: 经度，云朵位置的经度坐标。
   *   lat: 纬度，云朵位置的纬度坐标。
   *   height: 高度，云朵位置的高度。
   *   scaleX: x轴缩放，云朵的x轴缩放比例。
   *   scaleY: y轴缩放，云朵的y轴缩放比例。
   *   slice: 切片，用于控制云朵的形状。
   *   color: 颜色，云朵的颜色。
   *   maximumSizeX: x轴最大尺寸，云朵在x轴上的最大尺寸。
   *   maximumSizeY: y轴最大尺寸，云朵在y轴上的最大尺寸。
   *   maximumSizeZ: z轴最大尺寸，云朵在z轴上的最大尺寸。
   * @returns {Object} 返回添加的云朵实体对象。
   */
  addCloudEffect(option) {
    if (!this.ffCesiumCloudCollection) {
      this.ffCesiumCloudCollection = this.viewer.scene.primitives.add(
        new Cesium.CloudCollection({
          noiseDetail: 16.0,
          noiseOffset: Cesium.Cartesian3.ZERO,
        })
      );
    }

    let cloud = this.ffCesiumCloudCollection.add({
      position: Cesium.Cartesian3.fromDegrees(
        option.lng,
        option.lat,
        option.height
      ),
      scale: new Cesium.Cartesian2(option.scaleX, option.scaleY),
      slice: option.slice,
      color: Cesium.Color.fromCssColorString(option.color),
      maximumSize: new Cesium.Cartesian3(
        option.maximumSizeX,
        option.maximumSizeY,
        option.maximumSizeZ
      ),
    });
    return cloud;
  },

  /**
   * 添加雨滴效果到三维场景中。
   * 通过后期处理阶段（PostProcessStage）实现，利用片段着色器（fragment shader）改变像素颜色来模拟雨滴落在屏幕上的效果。
   *
   * @param {Object} option 配置选项，包含雨效果的各种参数。
   * @param {number} option.tiltAngle 雨滴倾斜角度，影响雨滴在屏幕上的分布。
   * @param {number} option.rainSize 雨滴大小，控制雨滴的视觉效果。
   * @param {number} option.rainWidth 雨滴宽度，影响雨滴在屏幕上的覆盖范围。
   * @param {number} option.rainSpeed 雨滴下落速度，调整雨滴下落的快慢。
   * @returns {Cesium.PostProcessStage} 创建的雨滴效果后期处理阶段对象。
   */
  addRainEffect(option) {
    const FS_Rain = `uniform sampler2D colorTexture;
			 in vec2 v_textureCoordinates;
       uniform float tiltAngle;
       uniform float rainSize;
       uniform float rainWidth;
       uniform float rainSpeed;
			 float hash(float x){
					return fract(sin(x*233.3)*13.13);
			 }
       out vec4 vFragColor;
			void main(void){
				float time = czm_frameNumber / rainSpeed;
			  vec2 resolution = czm_viewport.zw;
			  vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
			  vec3 c=vec3(1.0,1.0,1.0);
			  float a= tiltAngle;
			  float si=sin(a),co=cos(a);
			  uv*=mat2(co,-si,si,co);
			  uv*=length(uv+vec2(0,4.9))*rainSize + 1.;
			  float v = 1.0 - abs(sin(hash(floor(uv.x * rainWidth)) * 2.0));
			  float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
			  c*=v*b;
        vFragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c,.3), .3);
			}
    `;
    var rainEffect = new Cesium.PostProcessStage({
      name: "FFCesium.addRainEffect",
      fragmentShader: FS_Rain,
      uniforms: {
        tiltAngle: option.tiltAngle, //雨长度
        rainSize: option.rainSize, //雨长度
        rainWidth: option.rainWidth, //雨长度
        rainSpeed: option.rainSpeed, //雨长度
      },
    });
    this.viewer.scene.postProcessStages.add(rainEffect);
    return rainEffect;
  },
  /**
   * 移除雨效果
   * 从场景的后处理阶段中移除指定的雨效果。这使得雨不再出现在场景渲染中。
   * @param {Cesium.PostProcessStage} rainEffect - 要移除的雨效果实例。
   */
  removeRainEffect(rainEffect) {
    this.viewer.scene.postProcessStages.remove(rainEffect);
  },

  /**
   * 添加雪景效果的函数
   * @param {Object} option 配置选项，包含雪速等参数
   * @returns {Cesium.PostProcessStage} 创建的雪景后处理阶段对象
   */
  addSnowEffect(option) {
    const FS_Snow = `uniform sampler2D colorTexture;
    in vec2 v_textureCoordinates;
    uniform float snowSpeed;
    float snow(vec2 uv,float scale){
        float time = czm_frameNumber / snowSpeed;
        float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
        uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
        uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
        return k*w;
    }
    out vec4 vFragColor;
    void main(void){
        vec2 resolution = czm_viewport.zw;
        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
        vec3 finalColor=vec3(0);
        float c = 0.0;
        c+=snow(uv,50.)*.0;
        c+=snow(uv,30.)*.0;
        c+=snow(uv,10.)*.0;
        c+=snow(uv,5.);
        c+=snow(uv,4.);
        c+=snow(uv,3.);
        c+=snow(uv,2.);
        finalColor=(vec3(c));
        vFragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);
    }
    `;
    var snowEffect = new Cesium.PostProcessStage({
      name: "FFCesium.addSnowEffect",
      fragmentShader: FS_Snow,
      uniforms: {
        snowSpeed: option.snowSpeed, //雪速
      },
    });
    this.viewer.scene.postProcessStages.add(snowEffect);
    return snowEffect;
  },

  /**
   * 移除雪效果
   * 从场景的后处理阶段中移除指定的雪效果。这使得雪不再出现在渲染的图像中。
   * @param {Cesium.PostProcessStage} snowEffect 雪效果的后处理阶段实例。
   */
  removeSnowEffect(snowEffect) {
    this.viewer.scene.postProcessStages.remove(snowEffect);
  },

  /**
   * 添加雾效果的函数。
   * 通过在场景中添加雾的后处理阶段来实现雾的效果。
   *
   * @param {Object} option 雾的效果选项，包括雾的透明度。
   * @returns {Cesium.PostProcessStage} 添加的雾效果的后处理阶段对象。
   */
  addFogEffect(option) {
    const FS_Fog = `float getDistance(sampler2D depthTexture, vec2 texCoords)
    {
        float depth = czm_unpackDepth(texture(depthTexture, texCoords));
        if (depth == 0.0) {
            return czm_infinity;
        }
        vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
        return -eyeCoordinate.z / eyeCoordinate.w;
    }
    //根据距离，在中间进行插值
    float interpolateByDistance(vec4 nearFarScalar, float distance)
    {
        //根据常识，雾应该是距离远，越看不清，近距离内的物体可以看清
        //因此近距离alpha=0，远距离的alpha=1.0
        //本例中设置可见度为200米
        //雾特效的起始距离
        float startDistance = nearFarScalar.x;
        //雾特效的起始alpha值
        float startValue = nearFarScalar.y;
        //雾特效的结束距离
        float endDistance = nearFarScalar.z;
        //雾特效的结束alpha值
        float endValue = nearFarScalar.w;
        //根据每段距离占总长度的占比，插值alpha，距离越远，alpha值越大。插值范围0,1。
        float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0);
        return mix(startValue, endValue, t);
    }
    vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor)
    {
        return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a);
    }
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;
    uniform vec4 fogByDistance;
    uniform vec4 fogColor;
    in vec2 v_textureCoordinates;
    void main(void)
    {
        //获取地物距相机的距离
        float distance = getDistance(depthTexture, v_textureCoordinates);
        //获取场景原本的纹理颜色
        vec4 sceneColor = texture(colorTexture, v_textureCoordinates);
        //根据距离，对alpha进行插值
        float blendAmount = interpolateByDistance(fogByDistance, distance);
        //将alpha变化值代入雾的原始颜色中，并将雾与场景原始纹理进行融合
        vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount);
        out_FragColor = alphaBlend(finalFogColor, sceneColor);
    }`;
    var fogEffect = new Cesium.PostProcessStage({
      name: "FFCesium.addFogEffect",
      fragmentShader: FS_Fog,
      uniforms: {
        fogByDistance: new Cesium.Cartesian4(500, 0.0, 4000, option.alpha), //alpha 浓度
        fogColor: Cesium.Color.WHITE,
      },
    });
    this.viewer.scene.postProcessStages.add(fogEffect);
    return fogEffect;
  },
  /**
   * 移除雾效果
   * 从场景的后处理阶段中移除指定的雾效果。
   *
   * @param {Cesium.PostProcessStage} fogEffect 雾效果实例，将被从后处理阶段中移除。
   */
  removeFogEffect(fogEffect) {
    this.viewer.scene.postProcessStages.remove(fogEffect);
  },
  /**
   * 添加火焰效果。
   *
   * 该函数通过调用myParticleSystem的init方法，初始化粒子系统并将其添加到场景中，
   * 以实现火焰效果的视觉展示。适用于在三维场景中增加动态效果，如火箭发射、火山爆发等。
   *
   * @param {Object} lnglatheight - 地理位置和高度信息，用于确定粒子系统的位置。
   * @param {Object} option - 粒子系统的配置选项，用于定制火焰效果的表现。
   * @returns {Object} 返回添加到场景中的粒子系统对象，可用于后续操作或查询。
   */
  addFireEffect(lnglatheight, option) {
    let particlefire = myParticleSystem.init(lnglatheight, option);
    this.viewer.scene.primitives.add(particlefire);
    return particlefire;
  },
  /**
   * 移除三维场景中的火焰效果。
   *
   * @param {Object} primitive 要移除的火焰效果对象。
   *
   * 此函数用于从viewer的场景中移除指定的火焰效果对象。它通过打印日志来记录操作对象，
   * 然后调用scene.primitives.remove方法来实际执行移除操作。
   */
  removeFireEffect(primitive) {
    console.log("removeFireEffect--primitive", primitive);
    this.viewer.scene.primitives.remove(primitive);
  },
};
