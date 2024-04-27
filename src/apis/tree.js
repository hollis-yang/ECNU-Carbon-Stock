import httpInstance from '@/utils/http'

// 发送经纬度获取最近的树木记录
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

// 发送id获取该树木信息
export function getTreeInfo(id) {
  return httpInstance({
    url: 'treeid',
    method: 'POST',
    data: {
      id: id // 树木id
    }
  })
}
