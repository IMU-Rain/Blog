<script lang="ts" setup>
import { Icon } from "@iconify/vue";
const props = defineProps(["meta"]);
</script>

<template>
  <div class="card-container">
    <div class="info">
      <span class="title">{{ props.meta.title }}</span>
      <span class="number">{{ props.meta.number }}</span>
    </div>
    <div class="icon">
      <Icon :icon="props.meta.icon" width="50"></Icon>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/mixin.less";
@import "@/style/index.less";
.card-container {
  border: 1px solid #000;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  height: 100%;
  width: 100%;
  align-items: center;
  border-radius: @card-roudend;
  background-color: @card-background-color;
  box-shadow: @card-shadow;
  .info {
    display: flex;
    flex-direction: column;
    .title {
      font-weight: 600;
      font-size: 1.2rem;
    }
    .number {
      text-align: center;
    }
  }
}
</style>
