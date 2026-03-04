<template>
  <div class="albums-container">
    <div class="albums-container-midden">
      <LoadingSkeleton v-if="loading" />
      <ErrorSkeleton v-else-if="error" />
      <div
        class="album-container"
        v-masonry="masonryId"
        transition-duration="0s"
        item-selector=".item"
        v-else
      >
        <Photo
          v-for="(photo, index) in photoList"
          :key="photo._id"
          :photo="photo"
          class="item"
          @loaded="handlePhotoLoaded"
          @click="showphotoDetail(index)"
        ></Photo>
      </div>
      <PhotoDetail
        :photo="selectPhoto"
        :index="index"
        v-if="selectPhoto"
        @close="selectPhoto = null"
        @prev="switchPhoto($event - 1)"
        @next="switchPhoto($event + 1)"
      ></PhotoDetail>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import Photo from "../components/Photo.vue";
import { getAllPhotos } from "../api/photo";
import PhotoDetail from "../components/PhotoDetail.vue";
import { useRequest } from "../hooks/useRequest";
import type { PhotoType } from "../types/photo";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import { toAssetUrl } from "../hooks/url";

const selectPhoto = ref();
const index = ref();
const photoList = ref<PhotoType[]>([]);
const masonryId = "albumsMasonry";
const redrawVueMasonry = inject<(id?: string) => void>("redrawVueMasonry");
let masonryRedrawTimer: number | null = null;

const scheduleMasonryRedraw = () => {
  if (!redrawVueMasonry) {
    return;
  }
  if (masonryRedrawTimer !== null) {
    window.clearTimeout(masonryRedrawTimer);
  }
  masonryRedrawTimer = window.setTimeout(() => {
    redrawVueMasonry(masonryId);
    masonryRedrawTimer = null;
  }, 60);
};
const {
  loading,
  error,
  run,
} = useRequest<PhotoType[]>(getAllPhotos);

onMounted(async () => {
  const res = await run();
  if (!Array.isArray(res)) {
    return;
  }
  // 一次性标准化 URL，避免逐字段修改导致 masonry 重排抖动
  photoList.value = res.map((photo) => ({
    ...photo,
    smallThumbUrl: toAssetUrl(photo.smallThumbUrl),
    bigThumbUrl: toAssetUrl(photo.bigThumbUrl),
    url: toAssetUrl(photo.url),
  }));
  await nextTick();
  scheduleMasonryRedraw();
});

const handlePhotoLoaded = () => {
  scheduleMasonryRedraw();
};

const showphotoDetail = (selectIndex: number) => {
  selectPhoto.value = photoList.value![selectIndex];
  index.value = selectIndex;
};
const switchPhoto = (index: number) => {
  if (index === -1 || index === photoList.value!.length) {
    return;
  }
  showphotoDetail(index);
};

onBeforeUnmount(() => {
  if (masonryRedrawTimer !== null) {
    window.clearTimeout(masonryRedrawTimer);
    masonryRedrawTimer = null;
  }
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.albums-container {
  max-width: 100%;
  .albums-container-midden {
    width: 100%;
    min-height: 52vh;
    .error {
      padding: 20px;
      text-align: center;
      color: var(--text-muted);
    }
  }
}

.item {
  width: calc(33.33% - 16px);
  margin: 0 8px 16px;
}

@media (max-width: 780px) {
  .item {
    width: calc(50% - 16px);
  }
}

@media (max-width: 420px) {
  .item {
    width: 100%;
    margin: 0 0 14px;
  }
}
</style>
