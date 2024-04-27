<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref, markRaw } from 'vue'
import { useViewerStore } from './store/viewerStore'
import Layout from './components/Layout.vue'
import Tree from './components/Tree.vue'

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

  const rawViewer = markRaw(viewer)
  viewerStore.setCesiumViewer(rawViewer)
})
</script>

<template>
  <div class="top">
    <Layout class="layout"></Layout>
  </div>
  <div id="cesiumContainer" ref="containerRef">
    <Tree />
  </div>
</template>

<style scoped lang="scss">
@import './style/global.scss'
</style>
