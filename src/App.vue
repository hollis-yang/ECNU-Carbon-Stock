<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref, markRaw } from 'vue'
import { useViewerStore } from './store/viewerStore'
import { getNearestTree } from './apis/tree'
// import Tree from './components/Tree.vue'

const containerRef = ref()
const viewerStore = useViewerStore()

onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MGMyMWM0YS1lNDEyLTRjNWYtYTY3OS1jOTZkOWM1OThjYTEiLCJpZCI6MTkxMTMxLCJpYXQiOjE3MDU5MDY1ODN9.Tq3eObtuZJiqt4rDl-srQkMfz-WP9_EvKEPa_UvOI5s'

  const viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    // baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
    // homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
  })
  viewer._cesiumWidget._creditContainer.style.display = 'none'

  // 相机最大缩放距离
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 3000

  // 初始视角为ecnu
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(121.448729, 31.033008, 3000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    }
  })

  // 修改home button默认飞行位置
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(e => {
    e.cancel = true
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(121.448729, 31.033008, 3000)
    })
  })


  // 加载3dtiles模型
  const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tVjSrgznw/tileset.json',
  }))

  // 创建事件处理器实例
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  const longitude = ref()
  const latitude = ref()
  const treeData = ref()
  let selectedTree = null // 跟踪选中的树

  // 设置鼠标左键点击事件的处理函数
  handler.setInputAction(async (click) => {
    const scene = viewer.scene
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
        treeData.value = await getNearestTree(longitude.value, latitude.value, 3)
        console.log(treeData.value)

        // 移除上一个选中的树
        if (selectedTree) {
          viewer.entities.remove(selectedTree)
          selectedTree = null
        }

        // 在树的位置添加一个红色点
        const position = Cesium.Cartesian3.fromDegrees(treeData.value.lat, treeData.value.lng, 0)
        selectedTree = viewer.entities.add({
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





  const rawViewer = markRaw(viewer)
  viewerStore.setCesiumViewer(rawViewer)
})
</script>

<template>
  <div id="cesiumContainer" ref="containerRef">
    <!-- <Tree /> -->
  </div>
</template>

<style scoped lang="scss">
@import './style/global.scss'
</style>
