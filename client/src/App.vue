<script setup lang="ts">
import BackToTop from "./components/BackToTop.vue";
import MainNav from "./components/MainNav.vue";
</script>

<template>
  <MainNav></MainNav>
  <router-view class="router-view"></router-view>
  <BackToTop class="back-to-top-btn" />
</template>

<style scoped>
.router-view {
  width: 80%;
  margin: 0 auto;
}
.back-to-top-btn {
  position: fixed;
  right: 200px;
  bottom: 200px;
}
@media (max-width: 768px) {
  .router-view {
    margin: 0;
    width: 99vw;
    overflow: hidden;
  }
  .back-to-top-btn {
    position: fixed;
    right: 50px;
    bottom: 50px;
  }
}
</style>
