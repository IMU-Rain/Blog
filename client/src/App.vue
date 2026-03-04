<template>
  <MainNav />
  <main class="router-view page-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
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
  min-height: calc(100vh - 200px);
  margin-bottom: 56px;
}

@media (max-width: 768px) {
  .router-view {
    width: min(1280px, 96vw);
    margin-bottom: 96px;
    min-height: calc(100vh - 170px);
  }
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
