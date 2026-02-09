<script lang="ts" setup>
import MaxBar from "@/components/MaxBar.vue";
</script>

<template>
  <router-view></router-view>
  <MaxBar class="maxbar" />
</template>

<style scoped lang="less">
.maxbar {
  position: fixed;
  right: 50%;
  bottom: 10%;
  transform: translate(50%);
}
</style>
