<template>
</template>

<script setup>
import * as Cesium from 'cesium'
import { useViewerStore } from '@/store/viewerStore'

const viewerStore = useViewerStore()

const treeTileset1 = viewerStore.$state.cesiumViewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: 'http://localhost:9003/model/tahgr6WjU/tileset.json',
    maximumScreenSpaceError: 1,
    maximumNumberOfLoadedTiles: 1000
  })
)
</script>