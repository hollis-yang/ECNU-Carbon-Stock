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
          <el-checkbox-button value="各区域边界">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <FullScreen />
            </el-icon>
            <span style="vertical-align: middle">各区域边界</span>
          </el-checkbox-button>
          <el-checkbox-button value="建筑物模型">
            <el-icon :size="15" style="vertical-align: middle; margin-right: 0.3vw; margin-left: -0.3vw;">
              <OfficeBuilding />
            </el-icon>
            <span style="vertical-align: middle">建筑物模型</span>
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

const checkedLayers1 = ref('无地图')
const checkedLayers2 = ref(['各区域边界', '建筑物模型'])
const viewerStore = useViewerStore()

// 需要加载的数据们
let regionGeoJSON = null
let regionLabel = [null, null, null, null, null, null, null, null]
let buildingTileset = null

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
watch(checkedLayers1, (newVal, oldVal) => {
  console.log('当前选中的图层1：', newVal)
  // 碳储量格网地图
  if (newVal.includes('碳储量格网地图')) {
    console.log('碳储量格网地图被选中了')
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
  if (newVal.includes('各区域边界')) {
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
  // 建筑物3dtiles
  if (newVal.includes('建筑物模型')) {
    buildingTileset.show = true
  } else {
    buildingTileset.show = false
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

  // 加载building 3dtiles
  buildingTileset = await viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tiEIgZH04/tileset.json'
  }))
})
</script>

<style scoped lang="scss">
@import '@/style/Layer.scss'
</style>