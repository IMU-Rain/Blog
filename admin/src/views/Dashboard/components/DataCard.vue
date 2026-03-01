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
.card-container {
  border: 1px solid var(--line-color);
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
  height: 100%;
  width: 100%;
  align-items: center;
  border-radius: @card-roudend;
  color: var(--text-color);
  background-color: var(--surface-color);
  box-shadow: 0 8px 18px var(--shadow-color);
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
      background-color: var(--primary-weak);
      border-radius: 16px;
    }
  }
}

@media (max-width: 640px) {
  .card-container {
    min-height: 92px;
    padding: 0 16px;

    .info {
      .title {
        font-size: 1rem;
      }
    }
  }
}
</style>
