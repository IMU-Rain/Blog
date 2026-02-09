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
      <Icon :icon="props.meta.icon" width="30"></Icon>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/mixin.less";
@import "@/style/index.less";
.card-container {
  border: 2px solid rgba(120, 120, 120, 0.2);
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
  height: 100%;
  width: 100%;
  align-items: center;
  border-radius: @card-roudend;
  background-color: @card-background-color;
  box-shadow: 0 0 8px rgba(139, 210, 231, 0.5);
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
  .icon {
    position: relative;
    width: 30px;
    height: 30px;
    display: inline-block; /* 确保它不会拉伸 */
    &::after {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      background-color: rgba(130, 128, 255, 0.4);
      border-radius: 16px;
    }
  }
}
</style>
