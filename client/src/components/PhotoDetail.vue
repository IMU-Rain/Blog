<template>
  <teleport to="body" v-if="photoData">
    <div class="over-lay" @click="emit('close')">
      <div class="photo-detail">
        <img :src="photoData.url" class="photo" />
        <ul class="photo-meta">
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
    </div>
  </teleport>
</template>

<script lang="ts" setup name="PhotoDetail">
import { ref } from "vue";
import type { PhotoType } from "../types/photo";
const prop = defineProps<{ photo: PhotoType }>();
const photoData = ref(prop.photo);
const emit = defineEmits<{ (e: "close"): void }>();
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.8);
  .photo-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 80%;
    max-height: 100%;
    margin-top: 100px;
    .photo {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 80%;
      object-fit: contain;
    }
    .photo-meta {
      display: flex;
      height: fit-content;
      align-items: center;
      color: #8f8f8f;
      font-weight: 700;
      gap: 10vw;
      justify-content: space-between;
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
  }
}
</style>
