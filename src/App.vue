<script setup>
import * as Cesium from 'cesium'
import { onMounted, ref, markRaw } from 'vue'
import { useViewerStore } from './store/viewerStore'
import Test from './components/Test.vue'

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

  // // 相机最大缩放距离
  // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 3000

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

  // baseLayerPicker
  
  const rawViewer = markRaw(viewer)
  viewerStore.setCesiumViewer(rawViewer)
})
</script>

<template>
  <div id="cesiumContainer" ref="containerRef">
  </div>
  <Test class="c123"></Test>
</template>

<style scoped lang="scss">
#cesiumContainer {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.c123 {
  color: red;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100px;
  height: 100px;
}
</style>
