<template>
  <div class="data-card-container">
    <div class="data">
      <h6>{{ data.title }}</h6>
      <p>{{ data.number }}</p>
    </div>
    <div class="icon-container">
      <el-icon size="2rem"><component :is="data.icon" /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  data: { title: string; number: number; icon: string };
}>();
</script>

<style scoped lang="less">
@import "../../style/theme.less";
.data-card-container {
  height: 138px;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  border-radius: 1.8rem;
  background-color: @card-background-color;
  align-items: center;
  border: 1px solid rgb(220, 223, 230);
  .data {
    h6 {
      font-size: 1rem;
      color: @accent-color;
    }
    p {
      color: @primary-color;
      font-size: 2rem;
    }
  }
  .icon-container {
    width: 4rem;
    height: 4rem;
    color: rgb(93, 135, 255);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(238, 243, 255);
  }
}
</style>
