<template>
  <MainNav></MainNav>
  <router-view class="router-view"></router-view>
  <BackToTop class="back-to-top-btn" />
</template>

<script setup lang="ts">
import BackToTop from "./components/BackToTop.vue";
import MainNav from "./components/MainNav.vue";
import { onMounted, onUnmounted } from "vue";
import { useScrollsStore } from "./store/pinia";
const scrollStore = useScrollsStore();
const handleScroll = () => {
  scrollStore.updateScroll(window.scrollY);
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

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
