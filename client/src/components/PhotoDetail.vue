<template>
  <teleport to="body" v-if="photoData">
    <div class="over-lay" @click="emit('close')">
      <button
        class="switch-btn left btn"
        @click.stop="emit('prev', photoIndex)"
        aria-label="上一张"
      >
        <svg
          class="switch-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M15.5 4.5L8 12l7.5 7.5" />
        </svg>
      </button>
      <div class="photo-detail" @click.stop>
        <div class="photo-stage">
          <img
            v-show="isImageLoading"
            :src="photoData.bigThumbUrl"
            class="photo"
            @load="isImageLoading = true"
          />
          <div
            class="img-skeleton"
            :style="{ width: scaledWidth + 'px', height: scaledHeight + 'px' }"
            v-if="!isImageLoading"
          >
            Loading...
          </div>
        </div>
        <section class="photo-info">
          <h3 class="photo-name" :title="photoTitle">{{ photoTitle }}</h3>
          <p class="photo-description">{{ photoDescription }}</p>
          <ul class="photo-meta" v-if="hasMeta">
            <li v-if="photoData.shotTime">
              <span>{{
                dayjs(photoData.shotTime).format("YYYY年MM月DD日")
              }}</span>
            </li>
            <li
              class="photo-brand"
              v-if="photoData.camera?.make || photoData.camera?.model"
            >
              <img src="../assets/camera.svg" class="camera-icon" />
              <span
                >{{ photoData.camera.make }} {{ photoData.camera.model }}</span
              >
            </li>
            <li class="iso" v-if="photoData.camera?.iso">
              <span>ISO {{ photoData.camera.iso }}</span>
            </li>
            <li class="focal-length" v-if="photoData.camera?.focalLength">
              焦距 {{ photoData.camera.focalLength }}mm
            </li>
          </ul>
        </section>
      </div>
      <button
        class="switch-btn right btn"
        @click.stop="emit('next', photoIndex)"
        aria-label="下一张"
      >
        <svg
          class="switch-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8.5 4.5L16 12l-7.5 7.5" />
        </svg>
      </button>
    </div>
  </teleport>
</template>

<script lang="ts" setup name="PhotoDetail">
import { toRef, ref, onMounted, watch, computed, onBeforeUnmount } from "vue";
import type { PhotoType } from "../types/photo";
import dayjs from "dayjs";

const props = defineProps<{ photo: PhotoType; index: number }>();
const photoIndex = toRef(props, "index");
const photoData = toRef(props, "photo");
const isImageLoading = ref(false);
const scaledWidth = ref(0);
const scaledHeight = ref(0);

const photoTitle = computed(() => {
  return (
    photoData.value.originalName?.trim() ||
    photoData.value.filename?.trim() ||
    `照片 ${photoIndex.value + 1}`
  );
});

const photoDescription = computed(() => {
  return (
    photoData.value.description?.trim() ||
    photoData.value.excerpt?.trim() ||
    "这张照片暂时没有简介。"
  );
});

const hasMeta = computed(() => {
  const camera = photoData.value.camera;
  return Boolean(
    photoData.value.shotTime ||
    camera?.make ||
    camera?.model ||
    camera?.iso ||
    camera?.focalLength,
  );
});

const getScaledSize = () => {
  isImageLoading.value = false;
  if (!photoData.value.width || !photoData.value.height) {
    scaledWidth.value = 1103;
    scaledHeight.value = 621;
    return;
  }
  const originalWidth = photoData.value.width;
  const originalHeight = photoData.value.height;
  const maxWidth = window.innerWidth * 0.72;
  const maxHeight = window.innerHeight * 0.58;
  const scaleRadio = Math.min(
    maxWidth / originalWidth,
    maxHeight / originalHeight,
  );
  scaledWidth.value = scaleRadio * originalWidth;
  scaledHeight.value = scaleRadio * originalHeight;
};

const handleResize = () => {
  getScaledSize();
};

onMounted(() => {
  getScaledSize();
  window.addEventListener("resize", handleResize);
});

watch(photoData, getScaledSize);

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "prev", index: number): number;
  (e: "next", index: number): void;
}>();
</script>

<style scoped lang="less">
@import "../style/theme.less";

.over-lay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 2vw, 26px);
  padding: 24px;
  background: color-mix(in srgb, var(--bg-color) 26%, rgba(2, 8, 20, 0.9));
  backdrop-filter: blur(8px);

  .btn {
    flex-shrink: 0;
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    height: 56px;
    border: 1px solid color-mix(in srgb, var(--line-color) 82%, transparent);
    border-radius: 50%;
    font-size: 0;
    line-height: 0;
    color: var(--text-color);
    background: color-mix(in srgb, var(--panel-color) 88%, transparent);
    box-shadow: 0 10px 20px var(--shadow-color);
    transition: all 0.25s ease;

    &:hover {
      color: var(--surface-color);
      background: var(--primary-color);
      border-color: color-mix(
        in srgb,
        var(--primary-color) 42%,
        var(--line-color)
      );
    }
  }

  .switch-icon {
    width: 24px;
    height: 24px;
    display: block;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.3;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
  }

  .photo-detail {
    position: relative;
    width: min(1120px, 84vw);
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: clamp(14px, 1.8vw, 20px);
    border: 1px solid color-mix(in srgb, var(--line-color) 92%, transparent);
    border-radius: 18px;
    background: color-mix(in srgb, var(--surface-color) 92%, transparent);
    box-shadow: 0 24px 40px
      color-mix(in srgb, var(--shadow-color) 95%, transparent);
    overflow: hidden;
    animation: show 0.24s ease;

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid var(--line-color);
      background: color-mix(in srgb, var(--panel-color) 85%, transparent);
      color: var(--text-muted);
      font-size: 22px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;

      &:hover {
        color: var(--text-color);
        border-color: color-mix(
          in srgb,
          var(--primary-color) 35%,
          var(--line-color)
        );
        background: color-mix(
          in srgb,
          var(--primary-weak) 66%,
          var(--panel-color)
        );
      }
    }

    .photo-stage {
      width: 100%;
      min-height: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 14px;
      background: color-mix(in srgb, var(--panel-color) 66%, transparent);
      border: 1px solid color-mix(in srgb, var(--line-color) 84%, transparent);
      overflow: hidden;
    }

    .photo {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: calc(100vh - 310px);
      border-radius: 12px;
      object-fit: contain;
      box-shadow: 0 14px 30px
        color-mix(in srgb, var(--shadow-color) 90%, transparent);
    }

    .photo-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      border-radius: 14px;
      border: 1px solid color-mix(in srgb, var(--line-color) 82%, transparent);
      background: color-mix(in srgb, var(--panel-color) 72%, transparent);
    }

    .photo-name {
      margin: 0;
      line-height: 1.4;
      font-size: clamp(17px, 1.7vw, 24px);
      color: var(--text-color);
      letter-spacing: 0.02em;
      word-break: break-word;
    }

    .photo-description {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.65;
      max-height: 180px;
      overflow: auto;
      word-break: break-word;
    }

    .photo-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;

      li {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid color-mix(in srgb, var(--line-color) 78%, transparent);
        background: color-mix(in srgb, var(--surface-color) 78%, transparent);
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 600;
      }

      .camera-icon {
        width: 16px;
      }
    }
  }

  .img-skeleton {
    font-size: clamp(18px, 2.2vw, 24px);
    font-weight: 700;
    color: transparent;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-clip: text;
    background-image: linear-gradient(
      90deg,
      color-mix(in srgb, var(--text-muted) 70%, transparent) 0%,
      var(--text-color) 42%,
      color-mix(in srgb, var(--text-muted) 70%, transparent) 80%
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
}

@keyframes show {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .over-lay {
    padding: 10px;

    .switch-btn {
      display: none;
    }

    .photo-detail {
      width: 100%;
      max-height: calc(100vh - 20px);
      padding: 12px;
      border-radius: 14px;
      gap: 10px;

      .photo {
        max-height: calc(100vh - 290px);
      }

      .photo-info {
        padding: 12px;
      }

      .photo-description {
        font-size: 13px;
      }

      .photo-meta li {
        font-size: 12px;
      }
    }
  }
}
</style>
