<template>
</template>

<script setup>
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'
import { onMounted, ref } from 'vue'
import { getNearestTree } from '@/apis/tree'

onMounted(async () => {
  const viewerStore = await useViewerStore()

  // 加载3dtiles模型
  const treeTileset3 = viewerStore.$state.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tVjSrgznw/tileset.json',
  }))

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
        treeData.value = await getNearestTree(longitude.value, latitude.value, 3)
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