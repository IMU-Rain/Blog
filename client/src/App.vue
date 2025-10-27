<template>
  <MainNav></MainNav>
  <router-view v-slot="{ Component }" class="router-view">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
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
  overflow: hidden;
}

@media (max-width: 768px) {
  .router-view {
    margin: 0;
    width: 99vw;
    overflow: hidden;
  }
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
