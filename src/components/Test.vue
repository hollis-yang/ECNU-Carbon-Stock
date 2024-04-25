<template>
  <button @click="clickBtn"></button>
</template>

<script setup>
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'

const viewerStore = useViewerStore()
const clickBtn = () => {
  console.log(viewerStore.$state.cesiumViewer)
  // 初始视角为ecnu
  viewerStore.$state.cesiumViewer.scene.screenSpaceCameraController.maximumZoomDistance = 3000
}
</script>