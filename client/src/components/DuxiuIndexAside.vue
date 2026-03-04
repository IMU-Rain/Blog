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
  display: block;
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  overflow: hidden;
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
  .title {
    display: block;
    text-align: center;
    font-size: 24px;
  }
  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--line-color));
    box-shadow: 0 12px 24px color-mix(in srgb, var(--shadow-color) 88%, transparent);
  }
}
</style>
