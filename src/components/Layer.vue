<template>
  <div>
    <div class="layer">
      <div class="title">
        <span>| 图层管理器</span>
      </div>
      <div class="lselector">
        <el-radio-group v-model="checkedLayers" :max="1">
          <el-radio-button value="格网碳储量">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <Grid />
            </el-icon>
            <span style="vertical-align: middle">格网碳储量</span>
          </el-radio-button>
          <el-radio-button value="区域碳储量">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <Picture />
            </el-icon>
            <span style="vertical-align: middle">区域碳储量</span>
          </el-radio-button>
          <el-radio-button value="区域边界">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <FullScreen />
            </el-icon>
            <span style="vertical-align: middle">区域边界</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'

const checkedLayers = ref('区域边界')
const viewerStore = useViewerStore()

// 需要加载的数据们
let regionGeoJSON = null
let regionLabel = [null, null, null, null, null, null, null, null]

// regionLabel的内容准备
const regionName = [
  '1 数学楼物理楼',
  '2 文科楼区域',
  '3 图书馆教学楼',
  '4 本科生宿舍',
  '5 西操资环生科',
  '6 东操夏雨厅',
  '7 ABC楼音乐楼',
  '8 河口行政楼'
]
const regionCoordinates = [
  [121.44681913246636, 31.029098145760319],
  [121.45026388169502, 31.030042737008642],
  [121.44749186023823, 31.031699694223004],
  [121.44635467628473, 31.037368250723013],
  [121.44482821022113, 31.03419766728009],
  [121.45110166163902, 31.035555521318976],
  [121.44805465336024, 31.034933204669606],
  [121.44903111365221, 31.027541102238661]
]

// 监听单选框的变化
watch(checkedLayers, (newVal, oldVal) => {
  console.log('当前选中的图层：', newVal)
  // 碳储量格网地图
  if (newVal.includes('碳储量格网地图')) {
    console.log('碳储量格网地图被选中了')
  }
  // 碳储量区域地图
  if (newVal.includes('碳储量区域地图')) {
    console.log('碳储量区域地图被选中了')
  }
  // 区域边界
  if (newVal.includes('区域边界')) {
    // region
    regionGeoJSON.show = true
    // label
    for (let i = 0; i <= 7; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(regionName[i]).show = true
    }
  } else {
    // region
    regionGeoJSON.show = false
    // label
    for (let i = 0; i <= 7; i++) {
      viewerStore.$state.cesiumViewer.entities.getById(regionName[i]).show = false
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
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('rgba(0, 0, 0, 0.5)'),
        backgroundPadding: new Cesium.Cartesian2(5, 5),
      }
    })
  }
})
</script>

<style scoped lang="scss">
@import '@/style/Layer.scss'
</style>