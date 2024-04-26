import httpInstance from '@/utils/http'

// 函数用于发送经纬度，并获取最近的树木记录
export function getNearestTree(lng, lat, region) {
  return httpInstance({
    url: '/tree',
    method: 'POST',
    data: {
      lng: lng, // 经度
      lat: lat, // 纬度
      region: region // 区域代号
    },
  })
}
