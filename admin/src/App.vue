<script setup lang="ts">
import { onMounted } from "vue";
import { applyThemeMode, getStoredThemeMode } from "@/utils/theme";

onMounted(() => {
  applyThemeMode(getStoredThemeMode());
});
</script>

<template>
  <div class="app-shell">
    <router-view v-slot="{ Component, route }">
      <transition name="app-switch" mode="out-in">
        <component
          :is="Component"
          :key="route.matched[0]?.path || route.path"
          class="app-view"
        />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="less">
.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.app-view {
  max-width: 100%;
}

.app-switch-enter-active,
.app-switch-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.app-switch-enter-from,
.app-switch-leave-to {
  opacity: 0;
}

.app-switch-enter-from {
  transform: translateY(8px);
}

.app-switch-leave-to {
  transform: translateY(-6px);
}

.app-switch-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
}
</style>
