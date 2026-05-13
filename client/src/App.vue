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
  <LoginModal />
</template>

<script setup lang="ts">
import BackToTop from "./components/BackToTop.vue";
import LoginModal from "./components/LoginModal.vue";
import MainNav from "./components/MainNav.vue";
import { onMounted, onUnmounted } from "vue";
import axios from "axios";
import { getCurrentUser } from "./api/account";
import { useScrollsStore } from "./store/pinia";
import { useUserStore } from "./store/user";
const scrollStore = useScrollsStore();
const userStore = useUserStore();
const handleScroll = () => {
  scrollStore.updateScroll(window.scrollY);
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getCurrentUser()
    .then((user) => {
      userStore.setUser(user);
    })
    .catch((err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        userStore.clearUser();
      }
    });
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
