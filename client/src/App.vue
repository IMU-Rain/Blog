<script setup lang="ts">
import MainNav from "./components/MainNav.vue";
</script>

<template>
  <MainNav></MainNav>
  <router-view class="router-view"></router-view>
</template>

<style scoped>
.router-view {
  width: 80%;
  margin: 0 auto; 
}
@media (max-width: 768px) {
  .router-view {
    margin: 0;
    width: 99vw;
    overflow: hidden;
  }
}
</style>
