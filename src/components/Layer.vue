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
import { FullScreen } from '@element-plus/icons-vue';

const checkedLayers = ref('区域边界')

// 需要加载的数据们
let regionGeoJSON = null

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
    regionGeoJSON.show = true
  } else {
    regionGeoJSON.show = false
  }
}, { deep: true })  // 监视数组/对象内部值的变化

onMounted(async () => {
  const viewerStore = await useViewerStore()

  // 加载region.geojson
  regionGeoJSON = await Cesium.GeoJsonDataSource.load("/region.geojson", {
    stroke: Cesium.Color.WHITE,   // 边框颜色
    fill: Cesium.Color.GREEN.withAlpha(0.1),  // 填充颜色
    strokeWidth: 10, // 边框宽度
  })
  viewerStore.$state.cesiumViewer.dataSources.add(regionGeoJSON)
})
</script>

<style scoped lang="scss">
.layer {
  padding-top: 1vh;
  padding-left: 1.5vh;
  padding-right: 1.5vh;

  .title {
    font-size: 2.5vh;
    color: white;
    padding-bottom: 1.5vh;
  }
}
</style>