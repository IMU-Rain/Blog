<template>
  <div class="albums-container">
    <div class="albums-container-midden">
      <LoadingSkeleton v-if="loading" />
      <ErrorSkeleton v-else-if="error" />
      <div class="error" v-else-if="error">Error,Plz retry!</div>
      <div
        class="album-container"
        v-masonry
        transition-duration="0.3s"
        item-selector=".item"
        v-else
      >
        <Photo
          v-for="(photo, index) in photoList"
          :photo="photo"
          class="item"
          v-masonry-tile
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
import { onMounted, ref } from "vue";
import Photo from "../components/Photo.vue";
import { getAllPhotos } from "../api/photo";
import PhotoDetail from "../components/PhotoDetail.vue";
import { useRequest } from "../hooks/useRequest";
import type { PhotoType } from "../types/photo";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import axios from "../api/axios";

const selectPhoto = ref();
const index = ref();
const {
  data: photoList,
  loading,
  error,
  run,
} = useRequest<[PhotoType]>(getAllPhotos);

onMounted(() => {
  const url = axios.defaults.baseURL?.slice(
    0,
    axios.defaults.baseURL.length - 3
  );
  run().then(() => {
    // 拼接最小缩略图，中间缩略图，原图路径
    photoList.value?.map((photo) => {
      photo.smallThumbnailPath = `${url}${photo.smallThumbPath}`;
      photo.bigThumbnailPath = `${url}${photo.bigThumbPath}`;
      photo.url = `${url}${photo.path}`;
      console.log(photo);
      return;
    });
  });
});

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
</script>

<style scoped lang="less">
.albums-container {
  max-width: 100%;
  .albums-container-midden {
    margin: 0 auto;
    width: inherit;
    .loading {
      font-weight: 1000;
      font-size: 50px;
      background-clip: text;
      color: transparent;
      background-image: linear-gradient(
        90deg,
        black 0%,
        #888 30%,
        #fff 50%,
        #888 70%,
        black 80%
      );
      background-size: 400%;
      animation: shine 2s ease infinite;
    }
    @keyframes shine {
      0% {
        background-position: 100% center;
      }
      100% {
        background-position: 0% center;
      }
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
  }
}
</style>
