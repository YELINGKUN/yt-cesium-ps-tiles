import { ref } from "vue";
let size = 30;
let zhamnesize = 28;
const allListArr = ref([
  {
    type: "panorama",
    level: 1,
    name: "xx大坝",
    checkAll: false,
    isIndeterminate: false,
    checkedLayers: [],
    expanded: false,
    url: "../../../../../public/model/daba.glb",
    // lngLatHeight: [129.78207817041048, 46.69279627278922, 110], //大模型坐标
    lng: 129.78207817041048,
    lat: 46.69279627278922, //区域位置
    height: 105,
    optionModel: {
      url: "../../../../../public/model/daba.glb",
      scale: size,
      minimumPixelSize: size,
      maximumScale: size,
      pitchAngle: 0,
      rollAngle: 0,
      headingAngle: 87,
    },
    data: [
      {
        id: "xxx1",
        type: "addTdtVecLayerFun",
        name: "A放闸区",
        // url: panoramaPng,
        showFlag: true,
        lng: 129.78207817041048,
        lat: 46.69279627278922, //区域位置
        height: 105,
        checked: false,
        showChild: false,
        level: 2,
        value: [
          {
            name: "a1闸口",
            level: 3,
            lng: 129.78207817041048,
            lat: 46.69279627278922, //子模型坐标
            height: 105,
            checked: false,
            id: "a1",
            optionModel: {
              url: "../../../../../public/model/z1.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
            optionDoor: {
              url: "../../../../../public/model/m1.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
          },
          {
            name: "a2闸口",
            level: 3,
            lng: 129.78207817041048,
            lat: 46.69279627278922, //子模型坐标
            height: 105,
            checked: false,
            id: "a2",
            optionModel: {
              url: "../../../../../public/model/z2.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
            optionDoor: {
              url: "../../../../../public/model/m2.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
          },
          {
            name: "a5闸口",
            level: 3,
            lng: 129.78207817041048,
            lat: 46.69279627278922,
            height: 105,
            checked: false,
            id: "a5",
            optionModel: {
              url: "../../../../../public/model/z5.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
            optionDoor: {
              url: "../../../../../public/model/m5.glb",
              scale: size,
              minimumPixelSize: size,
              maximumScale: size,
              pitchAngle: 0,
              rollAngle: 0,
              headingAngle: 87,
            },
          },
        ],
      },
    ],
  },
]);
export default allListArr;
