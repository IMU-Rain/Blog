<script lang="ts" setup>
const props = defineProps(["meta"]);
console.log(props.meta);
</script>

<template>
  <div class="container">
    <div class="info">
      <span class="title"></span>
      <span class="number"></span>
    </div>
    <div class="icon">
      <span class="iconify" :data-icon="props.meta.icon" width="200px"></span>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
