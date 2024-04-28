<template>
  <div>
    <div class="inspector">
      <div class="title">
        <span>| 树木信息查看器</span>
      </div>
      <div class="tlocator">
        <el-input v-model="treeIDInput" style="width: 10vw; margin-right: 2vw;" placeholder="请输入TreeID" />
        <el-button type="primary" @click="locateTree(treeIDInput)">定位</el-button>
      </div>
      <div class="talert">
        {{ treeIDAlert }}
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { ref } from 'vue'
import { useViewerStore } from '@/store/viewerStore'
import { useTreeStore } from '@/store/treeStore'
import { getTreeInfo } from '@/apis/tree'


const treeIDInput = ref('')
const treeIDAlert = ref('')
const viewerStore = useViewerStore()
const treeStore = useTreeStore()

// 定位树木
const locateTree = (treeID) => {
  // 判断treeID是否符合要求
  const region = treeID.split('-')[0]
  if (region >= 1 && region <= 8) {
    getTreeByID(treeID)
  } else {
    treeIDAlert.value = 'TreeID错误，请重新输入'
    treeIDInput.value = ''
    setTimeout(() => {
      treeIDAlert.value = ''
    }, 2000)
  }
}

const getTreeByID = async (treeID) => {
  // 调用接口定位树木
  const treeInfo = await getTreeInfo(treeID)
  console.log(treeInfo[0].lng, treeInfo[0].lat)
  // 地图定位到树木位置
  viewerStore.$state.cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(treeInfo[0].lat, treeInfo[0].lng, 100),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0
    }
  })
  // 树木信息存入store
  treeStore.setTreeInfo(treeInfo[0])
  // 移除上一个选中的树
  if (treeStore.$state.selectedTree) {
    viewerStore.$state.cesiumViewer.entities.remove(treeStore.$state.selectedTree)
    treeStore.SelectedTree = null
  }
  // 在树的位置添加一个红色点
  const position = Cesium.Cartesian3.fromDegrees(treeInfo[0].lat, treeInfo[0].lng, 0)
  treeStore.$state.selectedTree = viewerStore.$state.cesiumViewer.entities.add({
    name: 'Red point',
    position: position,
    point: {
      pixelSize: 20,
      color: Cesium.Color.RED
    }
  })
  // 请求完成后总是清除输入框
  treeIDInput.value = ''
}
</script>

<style scoped lang="scss">
@import '@/style/Insepector.scss'
</style>