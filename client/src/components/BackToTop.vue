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
  width: 50px;
  height: 50px;
  padding: 5px;
  background-color: rgba(88, 88, 88, 0.4);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, background-color 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &:hover {
    background-color: rgba(88, 88, 88, 0.8);
  }
  img {
    transform: rotate(180deg);
    width: 100%;
    background-color: transparent;
  }
}
.show {
  opacity: 1;
  pointer-events: auto;
}
@media (prefers-color-scheme: dark) {
  .back-to-top-btn {
    background-color: rgba(125, 125, 125, 0.6);
    &:hover {
      background-color: rgba(125, 125, 125, 0.4);
    }
  }
}
</style>
