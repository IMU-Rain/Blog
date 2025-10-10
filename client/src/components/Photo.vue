<template>
  <div class="photo-container" v-if="photo">
    <img :src="photo.thumbnailUrl" loading="lazy" class="thumbnail" />
  </div>
</template>

<script lang="ts" setup>
import type { PhotoType } from "../types/photo";
const props = defineProps<{ photo: PhotoType }>();
console.log(props);
</script>
<style scoped lang="less">
@import "../style/theme.less";
.photo-container {
  max-width: 400px;
  position: relative;
  margin: 0 auto;
  display: inline-block;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  .thumbnail {
    display: block;
    width: 100%;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.03);
    }
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.2s ease;
  }
  &:hover::after {
    transform: scale(1.03);
    opacity: 1;
  }
}
@media (prefers-color-scheme: dark) {
  .photo-container {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
}
</style>
