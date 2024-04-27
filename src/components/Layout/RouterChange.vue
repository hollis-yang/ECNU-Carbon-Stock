<template>
  <div class="container">
    <router-link :to="{ path: '/screen' }">
      <el-button type="primary" plain size="small">
        <span class="desc" >--》 前往碳储量分析图表</span>
        <span><el-icon :size="17" style="vertical-align: middle;"><TrendCharts /></el-icon></span>
      </el-button>
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.desc {
  font-size: 2vh;
  vertical-align: middle;
  margin-right: 0.3vw;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
}
</style>