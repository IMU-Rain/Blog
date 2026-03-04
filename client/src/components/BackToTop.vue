<template>
  <button
    class="back-to-top-btn"
    :class="{ show: scrollStore.isScroll }"
    @click="scrollToTop"
  >
    <img src="../assets/downArrow.svg" />
  </button>
</template>

<script lang="ts" setup>

import { useScrollsStore } from "../store/pinia";

const scrollStore = useScrollsStore();
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

</script>

<style scoped lang="less">
@import "../style/theme.less";
.back-to-top-btn {
  z-index: 999;
  width: 48px;
  height: 48px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--line-color) 88%, transparent);
  background: color-mix(in srgb, var(--panel-color) 82%, transparent);
  box-shadow: 0 8px 18px var(--shadow-color);
  backdrop-filter: blur(6px);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  position: fixed;
  right: 28px;
  bottom: 46px;
  pointer-events: none;
  transform: translateY(8px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &:hover {
    background: color-mix(in srgb, var(--primary-color) 86%, var(--surface-color));
    border-color: color-mix(in srgb, var(--primary-color) 50%, var(--line-color));
    img {
      opacity: 1;
      filter: brightness(0) invert(1);
    }
  }
  img {
    transform: rotate(180deg);
    width: 100%;
    opacity: 0.82;
    transition:
      opacity 0.2s ease,
      filter 0.2s ease;
    background-color: transparent;
  }
}
.show {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
@media (max-width: 1200px) {
  .back-to-top-btn {
    right: 18px;
    bottom: 36px;
  }
}
@media (max-width: 768px) {
  .back-to-top-btn {
    display: none;
  }
}
</style>
