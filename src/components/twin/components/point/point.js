import zdian from "../闸控点.json";
import view from "../视频点.json";
import regimen from "../水情点.json";
// 闸控点
let zhakongdian = [
  {
    label: zdian.name,
    children: [],
  },
];

zdian.features = zdian.features.filter((item) => {
  if (item.geometry === null) {
    console.log("Removed item:", item);
    return false;
  }
  return true;
});
// 视屏点
let viewDate = [
  {
    label: view.name,
    children: [],
  },
];
let regimenDate = [
  {
    label: regimen.name,
    children: [],
  },
];
// 打印过滤后的数据
const countData = (newData, oldData) => {
  newData[0].children = oldData.features.map((item) => {
    let lng = null;
    let lat = null;
    let type = null;
    if (item.geometry) {
      lng = item.geometry.coordinates[0];
      lat = item.geometry.coordinates[1];
      type = item.geometry.type;
    }
    return {
      type: oldData.name,
      // type: type,
      showtype: item.properties.type,
      label: item.properties.name,
      id: item.properties.id,
      lng,
      lat,
      height: 0,
      state: "ok", // 状态
      speep: "-",
    };
  });
  return newData;
};
countData(zhakongdian, zdian);
countData(viewDate, view);
countData(regimenDate, regimen);
console.log("regimenDate", regimenDate);

export { zhakongdian, viewDate, regimenDate };
