<script lang="ts" setup>
import MaxBar from "@/components/MaxBar.vue";
</script>

<template>
  <div class="layout-shell">
    <div class="route-stage">
      <router-view v-slot="{ Component, route }">
        <transition name="view-switch">
          <component :is="Component" :key="route.fullPath" class="route-view" />
        </transition>
      </router-view>
    </div>
    <MaxBar class="maxbar" />
  </div>
</template>

<style scoped lang="less">
.layout-shell {
  min-height: 100vh;
  padding: 12px 0 92px;
}

.route-stage {
  position: relative;
}

.route-view {
  width: 100%;
}

.maxbar {
  position: fixed;
  right: 50%;
  bottom: 10%;
  transform: translate(50%);
  z-index: 120;
}

.view-switch-enter-active,
.view-switch-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.view-switch-enter-from,
.view-switch-leave-to {
  opacity: 0;
}

.view-switch-enter-from {
  transform: translateX(10px);
}

.view-switch-leave-to {
  transform: translateX(-10px);
}

.view-switch-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
}

@media (max-width: 760px) {
  .layout-shell {
    padding-top: 54px;
    padding-bottom: 84px;
  }

  .maxbar {
    width: calc(100vw - 20px);
    right: 10px;
    bottom: 10px;
    transform: none;
  }
}
</style>
