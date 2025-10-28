<template>
  <div class="aside">
    <PoemAside />
    <DuxiuIndexAside />
  </div>
</template>

<script lang="ts" setup>
import DuxiuIndexAside from "./DuxiuIndexAside.vue";
import PoemAside from "./PoemAside.vue";
</script>

<style scoped lang="less">
.aside {
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
