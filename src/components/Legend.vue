<template>
  <div class="container">
    <div class="top">
      <div class="title"><i><strong>Legend</strong></i></div>
      <div class="map">
        <div class="color-box"
          style="box-sizing: border-box; background-color: transparent; border: 0.25vh white solid;"></div>
        <div class="layer-name">区域边界</div>
      </div>
    </div>

    <div class="mapContainer" v-if="legendStore.$state.showMap1">
      <div class="desc">碳储量 (kg)</div>
      <div v-for="(color, index) in colors1" :key="index" class="map">
        <div class="color-box" :style="{ backgroundColor: getColorString(color) }"></div>
        <div class="layer-name">{{ layerNames1[index] }}</div>
      </div>
    </div>

    <div class="mapContainer" v-if="legendStore.$state.showMap2">
      <div class="desc">碳储量密度 (kg/m²)</div>
      <div v-for="(color, index) in colors2" :key="index" class="map">
        <div class="color-box" :style="{ backgroundColor: getColorString(color) }"></div>
        <div class="layer-name">{{ layerNames2[index] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLegendStore } from '@/store/legendStore'

const legendStore = useLegendStore()

const getColorString = (color) => {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
}

const colors1 = [
  [247, 252, 245, 1],
  [221, 242, 215, 1],
  [178, 224, 171, 1],
  [123, 199, 124, 1],
  [61, 167, 90, 1],
  [19, 126, 58, 1],
  [0, 68, 27, 1]
]
const layerNames1 = [
  '0',
  '0-1500',
  '1500-3000',
  '3000-5000',
  '5000-7500',
  '7500-10000',
  '10000-252782'
]

const colors2 = [
  [247, 252, 245, 1],
  [201, 234, 194, 1],
  [123, 199, 124, 1],
  [42, 146, 75, 1],
  [0, 68, 27, 1]
]
const layerNames2 = [
  '0.97-2',
  '2-2.5',
  '2.5-3',
  '3-3.5',
  '3.5-4.13'
]
</script>

<style scoped lang="scss">
.top {
  color: white;
  margin-top: -1vh;
  margin-bottom: 1vh;
  font-size: 2.25vh;

  .title {
    margin-bottom: 1vh;
  }
}

.desc {
  color: white;
  font-size: 2.25vh;
  margin-bottom: 1vh;
}

.map {
  display: flex;
  align-items: center;
  color: white;

  .color-box {
    width: 1vw;
    height: 1vw;
  }

  .layer-name {
    padding-left: 0.75vw;
    font-size: 2vh;
  }
}
</style>