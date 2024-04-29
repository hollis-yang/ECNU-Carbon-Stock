<template>
  <div class="container">
    <div class="inspector">
      <div class="title">
        <span>| 树木信息查看</span>
      </div>
      <div class="tlocator">
        <el-input v-model="treeIDInput" style="width: 13vw; margin-right: 2vw;" placeholder="请输入TreeID" />
        <el-button type="primary" @click="locateTree(treeIDInput)">定位</el-button>
      </div>
      <div class="talert" v-show="treeIDAlert">
        {{ treeIDAlert }}
      </div>
      <div class="treeInfo">
        <div class="leftTreeInfo">
          <div class="avatar">
            <el-avatar :size="70" src="/tree.png"></el-avatar>
          </div>
          <div class="info">
            <div class="treeid"><strong>树ID：</strong>{{ treeStore.$state.treeInfo.TreeID }}</div>
            <div class="treelng"><strong>经度：</strong>{{ typeof treeStore.$state.treeInfo.lat === 'number' ?
              `${treeStore.$state.treeInfo.lat.toFixed(4)}°E` : treeStore.$state.treeInfo.lat }}</div>
            <div class="treelat"><strong>纬度：</strong>{{ typeof treeStore.$state.treeInfo.lng === 'number' ?
              `${treeStore.$state.treeInfo.lng.toFixed(5)}°N` : treeStore.$state.treeInfo.lng }}</div>
            <div class="treeregion"><strong>区域：</strong>{{ treeStore.$state.treeInfo.TreeID === 'Pending ID' ?
              'Pending ID' : regionName[treeStore.$state.treeInfo.TreeID.split('-')[0] - 1].slice(2) }}</div>
          </div>
        </div>
        <div class="rightTreeInfo">
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label-class-name="my-label" class-name="my-content" align="center">
              <template #label>
                <div class="cell-item">
                  Carbon Stock (kg)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.Carbon.toFixed(3) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="my-label" align="center">
              <template #label>
                <div class="cell-item">
                  Tree Height (m)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.TreeHeight.toFixed(3) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="my-label" class-name="my-content" align="center">
              <template #label>
                <div class="cell-item">
                  DBH (m)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.DBH.toFixed(3) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="my-label" class-name="my-content" align="center">
              <template #label>
                <div class="cell-item">
                  Crown Area (m²)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.CrownArea.toFixed(3) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="my-label" class-name="my-content" align="center">
              <template #label>
                <div class="cell-item">
                  Crown Diameter (m)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.CrownDiameter.toFixed(3) }}
            </el-descriptions-item>
            <el-descriptions-item label-class-name="my-label" class-name="my-content" align="center">
              <template #label>
                <div class="cell-item">
                  Crown Volume (m³)
                </div>
              </template>
              {{ treeStore.$state.treeInfo.CrownVolume.toFixed(3) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
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
import { regionName } from '@/utils/region'

const treeIDInput = ref('')
const treeIDAlert = ref('')
const viewerStore = useViewerStore()
const treeStore = useTreeStore()


// 定位树木
const locateTree = (treeID) => {
  // 判断treeID是否符合要求
  if (treeID.includes('-')) {
    const region = treeID.split('-')[0]
    if (region >= 1 && region <= 8) {
      getTreeByID(treeID)
    } else {
      treeIDAlert.value = 'TreeID错误，请重新输入'
      treeIDInput.value = ''
      setTimeout(() => {
        treeIDAlert.value = ''
      }, 3000)
    }
  } else {
    treeIDAlert.value = 'TreeID错误，请重新输入'
    treeIDInput.value = ''
    setTimeout(() => {
      treeIDAlert.value = ''
    }, 3000)
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