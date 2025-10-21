<template>
  <teleport to="body" v-if="photoData">
    <div class="over-lay" @click.stop="emit('close')">
      <button
        class="switch-btn left btn"
        @click.stop="emit('prev', photoIndex)"
      >
        <
      </button>
      <div class="photo-detail" @click="emit('close')" v-show="isImageLoading">
        <img :src="photoData.url" class="photo" @load="isImageLoading = true" />
        <ul class="photo-meta" v-if="photoData.camera.iso">
          <li>
            <span>{{
              dayjs(photoData.shotTime).format("YYYY年MM月DD日")
            }}</span>
          </li>
          <li class="photo-brand">
            <img src="../assets/camera.svg" class="camera-icon" />
            <span
              >:{{ photoData.camera.make }}-{{ photoData.camera.model }}</span
            >
          </li>
          <li class="iso">
            <span>ISO:{{ photoData.camera.iso }}</span>
          </li>
          <li class="focal-length">焦距:{{ photoData.camera.focalLength }}</li>
        </ul>
      </div>
      <div
        class="img-skeleton"
        @click="emit('close')"
        :style="{ width: scaledWidth + 'px', height: scaledHeight + 'px' }"
        v-if="!isImageLoading"
      >
        Loading~~~Plz Waiting
      </div>
      <button
        class="switch-btn left btn"
        @click.stop="emit('next', photoIndex)"
      >
        >
      </button>
    </div>
  </teleport>
</template>

<script lang="ts" setup name="PhotoDetail">
import { toRef, ref, onMounted, watch } from "vue";
import type { PhotoType } from "../types/photo";
import dayjs from "dayjs";
const props = defineProps<{ photo: PhotoType; index: number }>();
const photoIndex = toRef(props, "index");
const photoData = toRef(props, "photo");
const isImageLoading = ref(false);
const scaledWidth = ref(0);
const scaledHeight = ref(0);
const getScaledSize = () => {
  isImageLoading.value = false;
  if (!photoData.value.width || !photoData.value.height) {
    scaledWidth.value = 1103;
    scaledHeight.value = 621;
    return;
  }
  const originalWidth = photoData.value.width;
  const originalHeight = photoData.value.height;
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;
  const scaleRadio = Math.min(
    maxWidth / originalWidth,
    maxHeight / originalHeight
  );
  scaledWidth.value = scaleRadio * originalWidth;
  scaledHeight.value = scaleRadio * originalHeight;
};
onMounted(getScaledSize);
watch(photoData, getScaledSize);
const emit = defineEmits<{
  (e: "close"): void;
  (e: "prev", index: number): number;
  (e: "next", index: number): void;
}>();
</script>

<style scoped lang="less">
.over-lay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50000;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3%;
  background-color: rgba(0, 0, 0, 0.8);
  .btn {
    border-radius: 50%;
    font-size: 20px;
    width: 65px;
    height: 65px;
    color: white;
    transition: all 0.25s ease;
    background-color: rgba(0, 0, 0, 0.5);
    &:hover {
      color: black;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .photo-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    max-width: 80%;
    height: 100%;
    overflow: hidden;
    .photo {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 80%;
      object-fit: contain;
      animation: show 180s ease;
    }
    .photo-meta {
      display: flex;
      height: fit-content;
      color: #8f8f8f;
      font-weight: 700;
      flex-wrap: wrap;
      gap: 10vw;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      .photo-brand {
        height: 10px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        .camera-icon {
          width: 30px;
        }
      }
    }
  }
  .img-skeleton {
    font-size: 30px;
    font-weight: 800;
    user-select: none;
    color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    background-clip: text;
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 40%,
      rgba(255, 255, 255, 0) 80%
    );
    background-size: 400%;
    animation: shine 2s ease-in-out infinite;
  }

  @keyframes shine {
    0% {
      background-position: 100% center;
    }
    100% {
      background-position: -100% center;
    }
  }
  animation: show 30s ease;
}
@keyframes show {
  0% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
}
@media (max-width: 768px) {
  .over-lay {
    .photo-detail {
      max-width: 80%;
      max-height: 80%;
      gap: 30px;
      margin-top: 0;
      .photo-meta {
        gap: 10px;
      }
    }
    .switch-btn {
      user-select: none;
      display: none;
    }
  }
}
</style>
