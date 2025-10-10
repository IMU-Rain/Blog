<template>
  <teleport to="body" v-if="photoData">
    <div class="over-lay">
      <button
        class="switch-btn left btn"
        @click.stop="emit('prev', photoIndex)"
      >
        <
      </button>
      <div class="photo-detail" @click="emit('close')">
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
import { toRef } from "vue";
import type { PhotoType } from "../types/photo";
const props = defineProps<{ photo: PhotoType; index: number }>();
const photoIndex = toRef(props, "index");
const photoData = toRef(props, "photo");
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
    .switch-btn{
      display: none;
    }
  }
}
</style>
