import { ref } from "vue";
const data = ref([
  {
    label: "大站点1",
    lng: 129.85897571573392,
    lat: 46.68706812460703,
    height: 60000,
    Camaralength: 5500,
    children: [
      {
        label: "工程1-1",
        id: "div3501", //唯一值
        lng: 130.009787983425923,
        lat: 46.853550668738748,
        // lng: 129.8607663324511,
        // lat: 46.710408594917055,
        height: 0, //第一个点离地高度
        Camaralength: 2500, //线点高
        type: "engineering",
        state: "ok",
        titile: "标题",
        data: { bute: "1流域1", type: "在线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "xx设备1",
            lng: 129.86027817041048,
            lat: 46.70988627278922,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "闸门31",
                id: "model11",
                url: "/public/model/zhamen1.glb",
                lng: 129.85527817041048,
                lat: 46.70988627278922,
                height: 300, //第一个点离地高度
                Camaralength: 0,
              },
              {
                label: "闸门31",
                id: "model12",
                url: "/public/model/zhamen1.glb",
                lng: 129.8611311128772,
                lat: 46.70953315074044,
                height: 100, //第一个点离地高度
                Camaralength: 0,
              },
            ],
          },
        ],
      },
      {
        label: "工程1-2",
        id: "div3502",
        lng: 129.908688219228,
        lat: 46.71141644163751,
        height: 0, //第一个点离地高度
        Camaralength: 2500,
        type: "engineering",
        state: "off",
        titile: "标题",
        data: { bute: "1流域222", type: "在线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "11111xx设备2",
            id: "model3",
            url: "/public/model/zhamen1.glb",
            lng: 129.8678688219228,
            lat: 46.71141644163751,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "设备21",
                id: "model221",
                url: "/public/model/zhamen1.glb",
                lng: 129.86907045156147,
                lat: 46.71141644163751,
                Camaralength: 0,
                height: 100, //第一个点离地高度
              },
              {
                Camaralength: 0,
                label: "设备21",
                id: "model222",
                url: "/public/model/zhamen1.glb",
                lng: 129.87021843701973,
                lat: 46.71557828388269,
                height: 100, //第一个点离地高度
              },
            ],
          },
        ],
      },
      {
        label: "渠首闸控",
        id: "div3502",
        lng: 129.720664055967802,
        lat: 46.68634889891328,
        height: 0, //第一个点离地高度
        Camaralength: 2500,
        type: "engineering",
        state: "off",
        titile: "标题",
        data: { bute: "1流域222", type: "在线", time: "2024/8/6" }, //标签需要的值
        children: [
          {
            label: "11111xx设备2",
            id: "model3",
            url: "/public/model/zhamen1.glb",
            lng: 129.8678688219228,
            lat: 46.71141644163751,
            height: 0, //第一个点离地高度
            Camaralength: 2000,
            children: [
              {
                label: "设备21",
                id: "model221",
                url: "/public/model/zhamen1.glb",
                lng: 129.86907045156147,
                lat: 46.71141644163751,
                Camaralength: 0,
                height: 100, //第一个点离地高度
              },
              {
                Camaralength: 0,
                label: "设备21",
                id: "model222",
                url: "/public/model/zhamen1.glb",
                lng: 129.87021843701973,
                lat: 46.71557828388269,
                height: 100, //第一个点离地高度
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   label: "大站点2",
  //   lng: 129.8153189829028,
  //   lat: 46.668786855226425,
  //   height: 60000,
  //   Camaralength: 5500,
  //   children: [
  //     {
  //       label: "分站1-1",
  //       id: "div201", //唯一
  //       lng: 129.8053189829028,
  //       lat: 46.685786855226425,
  //       height: 0, //第一个点离地高度
  //       Camaralength: 2500,
  //       type: "engineeringok",
  //       // image: engineeringlogo,
  //       titile: "标题",
  //       data: { bute: "2222流域1", type: "离线", time: "2024/8/6" }, //标签需要的值
  //       children: [
  //         {
  //           label: "1111xx设备2",
  //           lng: 129.8153189829028,
  //           lat: 46.688786855226425,
  //           height: 0, //第一个点离地高度
  //           Camaralength: 2000,
  //           children: [
  //             {
  //               label: "设备21",
  //               id: "model21",
  //               url: "/public/model/zhamen1.glb",
  //               lng: 129.81264719491512,
  //               lat: 46.6877372418536,
  //               Camaralength: 0,
  //               height: 55, //第一个点离地高度
  //             },
  //             {
  //               Camaralength: 0,
  //               label: "设备21",
  //               id: "model22",
  //               url: "/public/model/zhamen1.glb",
  //               lng: 129.8188806486657,
  //               lat: 46.68852472440392,
  //               height: 55, //第一个点离地高度
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "大站点3",
  //   lng: 129.68840999436603,
  //   lat: 46.65964931855072,
  //   height: 50000,
  //   Camaralength: 5500,
  //   children: [
  //     {
  //       Camaralength: 2500,
  //       label: "分站1-1",
  //       id: "div101",
  //       lng: 129.69440999436603,
  //       lat: 46.68257303585382,
  //       height: 0, //第一个点离地高度
  //       linelength: 2000, //线点高
  //       image: engineeringlogo,
  //       // showtitle: false, //是否显示介绍
  //       titile: "3333333",
  //       data: { bute: "33333流域1", type: "离线", time: "2024/8/7" }, //标签需要的值
  //       children: [
  //         {
  //           label: "闸门类",
  //           lng: 129.69493312669024,
  //           lat: 46.6857303585382,
  //           height: 0, //第一个点离地高度
  //           Camaralength: 2000,
  //           children: [
  //             {
  //               Camaralength: 0,
  //               label: "闸门31",
  //               id: "model31",
  //               url: "/public/model/zhamen1.glb",
  //               lng: 129.69493312669024,
  //               lat: 46.68635218740141,
  //               height: 100, //第一个点离地高度
  //             },
  //             {
  //               Camaralength: 0,
  //               label: "3333xx设备2",
  //               id: "model32",
  //               url: "/public/model/zhamen1.glb",
  //               lng: 129.70317934256167,
  //               lat: 46.68729839888073,
  //               height: 100, //第一个点离地高度
  //             },
  //             {
  //               Camaralength: 0,
  //               label: "3333xx设备3",
  //               id: "model33",
  //               url: "/public/model/zhamen1.glb",
  //               lng: 129.68524072867007,
  //               lat: 46.68155747835286,
  //               height: 100, //第一个点离地高度
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
]);
export default data;
