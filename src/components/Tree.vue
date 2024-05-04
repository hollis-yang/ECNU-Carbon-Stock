<template>
  <div>
    <div class="region">
      <div class="title">
        <span>| 区域选择</span>
      </div>
      <div class="rselector">
        <el-checkbox v-model="regionChecked[0]" label="1 数学楼物理楼" border />
        <el-checkbox v-model="regionChecked[1]" label="2 文科楼区域" border />
        <el-checkbox v-model="regionChecked[2]" label="3 图书馆教学楼" border />
        <el-checkbox v-model="regionChecked[3]" label="4 本科生宿舍" border />
        <el-checkbox v-model="regionChecked[4]" label="5 西操资环生科" border />
        <el-checkbox v-model="regionChecked[5]" label="6 东操夏雨厅" border />
        <el-checkbox v-model="regionChecked[6]" label="7 ABC楼音乐楼" border />
        <el-checkbox v-model="regionChecked[7]" label="8 河口行政楼" border />
      </div>
      <div class="rsubmit">
        <el-button type="primary" @click="submitRegion">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'
import { useTreeStore } from '@/store/treeStore'
import { onMounted, ref } from 'vue'
import { getNearestTree } from '@/apis/tree'
import { regionCoordinates } from '@/utils/region'
import { treeTilesetUrls } from '@/utils/tileset'

// region选择器状态
const regionChecked = ref(new Array(8).fill(false))

// store
let viewerStore = useViewerStore()
let treeStore = useTreeStore()

// 初始化8个区域的3dtiles模型
const treeTilesets = new Array(8).fill(null)
// 初始化8个区域灌木的geojson
const gmGeoJsons= new Array(8).fill(null)


// 确认选择的区域
const submitRegion = () => {
  console.log(regionChecked.value)
  // 显示所选区域的3dtiles模型
  for (let i = 0; i < 8; i++) {
    if (regionChecked.value[i]) {
      treeTilesets[i].show = true
    } else {
      treeTilesets[i].show = false
    }
  }
  // 显示所选区域的灌木geojson
  for (let i = 0; i < 8; i++) {
    if (regionChecked.value[i]) {
      gmGeoJsons[i].show = true
    } else {
      gmGeoJsons[i].show = false
    }
  }

  // 视角飞到所选区域的中心
  // 获得所选区域的下标
  const regionIndexes = regionChecked.value
    .map((value, index) => value ? index : -1)
    .filter(index => index !== -1)
  console.log(regionIndexes)
  // 区分所选区域的个数
  if (regionIndexes.length === 1) {
    const selectedCoordinates = regionCoordinates[regionIndexes[0]]
    // 地图定位到树木位置
    viewerStore.$state.cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedCoordinates[0] - 0.0006, selectedCoordinates[1], 600),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
      }
    })
  } else {
    const selectedCoordinates = []
    regionIndexes.forEach(index => {
      selectedCoordinates.push(regionCoordinates[index][0], regionCoordinates[index][1])
    })
    // 确定这些区域的中心
    const positions = Cesium.Cartesian3.fromDegreesArray(selectedCoordinates)
    const cartesian = Cesium.BoundingSphere.fromPoints(positions).center
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    const lng = Cesium.Math.toDegrees(cartographic.longitude)
    const lat = Cesium.Math.toDegrees(cartographic.latitude)
    // 地图定位到树木位置
    viewerStore.$state.cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng - 0.001, lat, 800),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
      }
    })
  }
}

onMounted(async () => {
  viewerStore = await useViewerStore()
  // 加载3dtiles模型
  for (let i = 0; i < 8; i++) {
    treeTilesets[i] = await viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: treeTilesetUrls[i]
    }))
    treeTilesets[i].show = false
  }

  // 加载灌木geojson
  for (let i = 0; i < 8; i ++) {
    gmGeoJsons[i] = await Cesium.GeoJsonDataSource.load(`/g${i + 1}.geojson`, {
      stroke: Cesium.Color.WHITE,   // 边框颜色
      fill: Cesium.Color.GREEN.withAlpha(1),  // 填充颜色
      strokeWidth: 0, // 边框宽度
    })
    viewerStore.$state.cesiumViewer.dataSources.add(gmGeoJsons[i])
    gmGeoJsons[i].show = false
  }

  // 创建事件处理器实例
  const handler = new Cesium.ScreenSpaceEventHandler(viewerStore.$state.cesiumViewer.scene.canvas)

  const longitude = ref()
  const latitude = ref()
  const treeData = ref()

  // 设置鼠标左键点击事件的处理函数
  handler.setInputAction(async (click) => {
    const scene = viewerStore.$state.cesiumViewer.scene
    const pickedFeature = scene.pick(click.position)

    console.log(pickedFeature)

    if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
      // 获取点击位置的世界坐标
      const cartesian = scene.pickPosition(click.position)

      if (Cesium.defined(cartesian)) {
        // 将世界坐标转换为地理坐标
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        longitude.value = Cesium.Math.toDegrees(cartographic.longitude)
        latitude.value = Cesium.Math.toDegrees(cartographic.latitude)
        console.log(`拾取到的坐标: Longitude: ${longitude.value}, Latitude: ${latitude.value}`)

        // 找到点击的树
        const checkedRegion = regionChecked.value
          .map((value, index) => value ? index + 1 : -1)  // 如果元素为true，则保留索引+1，否则设为-1
          .filter(index => index !== -1)  // 过滤掉为-1的元素，只保留有效的索引+1
        treeData.value = await getNearestTree(longitude.value, latitude.value, checkedRegion)
        // 将data存入pinia
        treeStore.setTreeInfo(treeData.value)
        console.log(treeData.value)

        // 移除上一个选中的树
        if (treeStore.$state.selectedTree) {
          viewerStore.$state.cesiumViewer.entities.remove(treeStore.$state.selectedTree)
          treeStore.SelectedTree = null
        }

        // 在树的位置添加一个红色点
        const position = Cesium.Cartesian3.fromDegrees(treeData.value.lng, treeData.value.lat, 0)
        treeStore.$state.selectedTree = viewerStore.$state.cesiumViewer.entities.add({
          name: 'Red point',
          position: position,
          point: {
            pixelSize: 20,
            color: Cesium.Color.RED
          }
        })
      } else {
        console.log("No position found.")
      }

    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})
</script>

<style scoped lang="scss">
@import '@/style/Tree.scss'
</style>