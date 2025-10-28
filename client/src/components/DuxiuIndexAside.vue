<template>
  <RouterLink to="/economy" class="duxiuindex-container">
    <DuxiuIndex height="200px" />
  </RouterLink>
</template>

<script lang="ts" setup>
import DuxiuIndex from "../components/DuxiuIndex.vue";
</script>

<style scoped lang="less">
@import "../style/theme.less";
.duxiuindex-container {
  transition: all 0.3s ease;
  background-color: @card-background-color;
  .title {
    display: block;
    text-align: center;
    font-size: 24px;
  }
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.3);
  }
}
@media (prefers-color-scheme: dark) {
  .duxiuindex-container {
    background-color: @dark-card-background-color;
    &:hover {
      box-shadow: 0 0 15px 2px rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
