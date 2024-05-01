<template>
  <div>
    <div class="layer">
      <div class="title">
        <span>| 图层管理</span>
      </div>
      <div class="lselector">
        <!-- 单选框 -->
        <el-radio-group v-model="checkedLayers1" :max="1">
          <el-radio-button value="碳储量格网地图">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <Grid />
            </el-icon>
            <span style="vertical-align: middle">碳储量格网地图</span>
          </el-radio-button>
          <el-radio-button value="区域碳储量地图">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <Picture />
            </el-icon>
            <span style="vertical-align: middle">区域碳储量地图</span>
          </el-radio-button>
          <el-radio-button value="无地图">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <Close />
            </el-icon>
            <span style="vertical-align: middle">无地图</span>
          </el-radio-button>
        </el-radio-group>
        <!-- 多选框 -->
        <el-checkbox-group v-model="checkedLayers2" style="margin-top: 1.3vh;">
          <el-checkbox-button value="区域边界">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <FullScreen />
            </el-icon>
            <span style="vertical-align: middle">区域边界</span>
          </el-checkbox-button>
          <el-checkbox-button value="区域注记">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <FullScreen />
            </el-icon>
            <span style="vertical-align: middle">注记</span>
          </el-checkbox-button>
          <el-checkbox-button value="建筑模型">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <OfficeBuilding />
            </el-icon>
            <span style="vertical-align: middle">建筑模型</span>
          </el-checkbox-button>
          <el-checkbox-button value="建筑注记">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <OfficeBuilding />
            </el-icon>
            <span style="vertical-align: middle">注记</span>
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'
import { regionCoordinates, regionName } from '@/utils/region'
import { buildingCoordinates, buildingName } from '@/utils/building'

const checkedLayers1 = ref('无地图')
const checkedLayers2 = ref(['区域边界', '区域注记', '建筑模型'])
const viewerStore = useViewerStore()

// 需要加载的数据们
let regionGeoJSON = null
let regionLabel = new Array(8).fill(null)
let buildingTileset = null
let buildingLabel = new Array(53).fill(null)
let WMSMap1 = null
let WMSMap2 = null


// 监听单选框的变化
watch(checkedLayers1, (newVal, oldVal) => {
  console.log('当前选中的图层1：', newVal)
  // 碳储量格网地图
  if (newVal.includes('碳储量格网地图')) {
    WMSMap1.show = true
  } else {
    WMSMap1.show = false
  }
  // 碳储量区域地图
  if (newVal.includes('碳储量区域地图')) {
    console.log('碳储量区域地图被选中了')
  }
}, { deep: true })  // 监视数组/对象内部值的变化


// 监听多选框的变化
watch(checkedLayers2, (newVal, oldVal) => {
  console.log('当前选中的图层2：', newVal)
  // 区域边界
  if (newVal.includes('区域边界')) {
    regionGeoJSON.show = true
  } else {
    regionGeoJSON.show = false
  }
  // 区域注记
  if (newVal.includes('区域注记')) {
    for (let i = 0; i <= 7; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(regionName[i]).label.show = true
    }
  } else {
    for (let i = 0; i <= 7; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(regionName[i]).label.show = false
    }
  }
  // 建筑物3dtiles
  if (newVal.includes('建筑模型')) {
    buildingTileset.show = true
  } else {
    buildingTileset.show = false
  }
  // 建筑物注记
  if (newVal.includes('建筑注记')) {
    for (let i = 0; i < 53; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(buildingName[i]).label.show = true
    }
  } else {
    for (let i = 0; i < 53; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(buildingName[i]).label.show = false
    }
  }
}, { deep: true })  // 监视数组/对象内部值的变化


onMounted(async () => {
  // 加载region.geojson
  regionGeoJSON = await Cesium.GeoJsonDataSource.load("/region.geojson", {
    stroke: Cesium.Color.WHITE,   // 边框颜色
    fill: Cesium.Color.GREEN.withAlpha(0.1),  // 填充颜色
    strokeWidth: 10, // 边框宽度
  })
  viewerStore.$state.cesiumViewer.dataSources.add(regionGeoJSON)

  // 加载regionLabel
  for (let i = 0; i <= 7; i++) {
    viewerStore.$state.cesiumViewer.entities.add({
      id: regionName[i],
      position: Cesium.Cartesian3.fromDegrees(regionCoordinates[i][0], regionCoordinates[i][1]),
      label: {
        text: regionName[i],
        font: '2vh sans-serif',
        fillColor: Cesium.Color.WHITE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 0, 0, 0.4)'),
        backgroundPadding: new Cesium.Cartesian2(5, 5),
      }
    })
  }

  // 加载building 3dtiles
  buildingTileset = await viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tvh39XeWj/tileset.json'
  }))

  // 加载building name
  for (let i = 0; i < 53; i++) {
    viewerStore.$state.cesiumViewer.entities.add({
      id: buildingName[i],
      position: Cesium.Cartesian3.fromDegrees(buildingCoordinates[i][0], buildingCoordinates[i][1]),
      label: {
        text: buildingName[i],
        font: '1.75vh sans-serif',
        fillColor: Cesium.Color.BLACK,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }
    })
    viewerStore.$state.cesiumViewer.entities.getById(buildingName[i]).label.show = false
  }

  // 加载WMS地图1
  WMSMap1 = viewerStore.$state.cesiumViewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'http://localhost:8080/geoserver/geoserverTest/wms',
    layers: '	geoserverTest:region_boundary4326',
    parameters: {
      service: 'WMS',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      tiled: true
    }
  }))
  WMSMap1.show = false
})
</script>

<style scoped lang="scss">
@import '@/style/Layer.scss'
</style>