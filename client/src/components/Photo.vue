<template>
  <div class="photo-container" v-if="photo" :style="cardStyle">
    <img
      :src="photo.smallThumbUrl"
      loading="lazy"
      class="thumbnail"
      @load="emit('loaded')"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { PhotoType } from "../types/photo";
const props = defineProps<{ photo: PhotoType }>();
const emit = defineEmits<{
  (e: "loaded"): void;
}>();
const cardStyle = computed(() => {
  const width = Number(props.photo?.width || 0);
  const height = Number(props.photo?.height || 0);
  if (width > 0 && height > 0) {
    return {
      aspectRatio: `${width} / ${height}`,
    };
  }
  return {};
});
</script>
<style scoped lang="less">
@import "../style/theme.less";
.photo-container {
  width: 100%;
  position: relative;
  margin: 0 auto;
  display: inline-block;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--line-color);
  background: var(--surface-color);
  box-shadow: 0 8px 18px var(--shadow-color);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;

  .thumbnail {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    box-shadow: inset 0 -120px 120px color-mix(in srgb, var(--primary-color) 8%, transparent);
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--line-color));
    box-shadow: 0 12px 24px color-mix(in srgb, var(--shadow-color) 90%, transparent);
    .thumbnail {
      transform: scale(1.03);
    }
    &::after {
      transform: scale(1.03);
      opacity: 1;
    }
  }
}
</style>
