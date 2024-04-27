<template>
  <div>
    <div class="region">
      <div class="title">
        <span>| 区域选择器</span>
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
import { onMounted, ref } from 'vue'
import { getNearestTree } from '@/apis/tree'

// region选择器状态
const regionChecked = ref([false, false, false, false, false, false, false, false])

// 初始化8个区域的3dtiles模型
let treeTileset1 = null
let treeTileset2 = null
let treeTileset3 = null
let treeTileset4 = null
let treeTileset5 = null
let treeTileset6 = null
let treeTileset7 = null
let treeTileset8 = null

// 确认选择的区域
const submitRegion = () => {
  console.log(regionChecked.value)
  // treeTileset1.show = regionChecked.value[0]
  treeTileset2.show = regionChecked.value[1]
  treeTileset3.show = regionChecked.value[2]
  treeTileset4.show = regionChecked.value[3]
  treeTileset5.show = regionChecked.value[4]
  treeTileset6.show = regionChecked.value[5]
  treeTileset7.show = regionChecked.value[6]
  treeTileset8.show = regionChecked.value[7]
}

onMounted(async () => {
  const viewerStore = await useViewerStore()

  // 加载3dtiles模型
  // treeTileset1 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  //   url: 'http://localhost:9003/model/t7EgflT0u/tileset.json',
  // }))
  // treeTileset1.show = false

  treeTileset2 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/t7EgflT0u/tileset.json',
  }))
  treeTileset2.show = false

  treeTileset3 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tqLBvVbc9/tileset.json',
  }))
  treeTileset3.show = false

  treeTileset4 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tv1d61XW7/tileset.json',
  }))
  treeTileset4.show = false

  treeTileset5 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/trtk1rELn/tileset.json',
  }))
  treeTileset5.show = false

  treeTileset6 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tqNxQd9Iz/tileset.json',
  }))
  treeTileset6.show = false

  treeTileset7 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tDzs2ueft/tileset.json',
  }))
  treeTileset7.show = false

  treeTileset8 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tPTgPPlE6/tileset.json',
  }))
  treeTileset8.show = false


  // 创建事件处理器实例
  const handler = new Cesium.ScreenSpaceEventHandler(viewerStore.$state.cesiumViewer.scene.canvas)

  const longitude = ref()
  const latitude = ref()
  const treeData = ref()
  let selectedTree = null // 跟踪选中的树

  // 设置鼠标左键点击事件的处理函数
  handler.setInputAction(async (click) => {
    const scene = viewerStore.$state.cesiumViewer.scene
    const pickedFeature = scene.pick(click.position)

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
        console.log(treeData.value)

        // 移除上一个选中的树
        if (selectedTree) {
          viewerStore.$state.cesiumViewer.entities.remove(selectedTree)
          selectedTree = null
        }

        // 在树的位置添加一个红色点
        const position = Cesium.Cartesian3.fromDegrees(treeData.value.lat, treeData.value.lng, 0)
        selectedTree = viewerStore.$state.cesiumViewer.entities.add({
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
.region {
  padding-left: 1.5vh;
  padding-right: 1.5vh;
  padding-top: 1vh;

  .title {
    font-size: 2.5vh;
    color: white;
    padding-bottom: 1.5vh;
  }

  .rselector {
    margin-top: 0.5vh;
    display: flex;
    flex-wrap: wrap;
    gap: 1vh;

    ::v-deep .el-checkbox__label {
      color: white;
      font-size: 1.6vh !important;
    }

    ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #409EFF !important;
    }
  }

  .rsubmit {
    margin-top: -4vh;
    margin-right: 2vh;
    display: flex;
    justify-content: right;
  }
}
</style>