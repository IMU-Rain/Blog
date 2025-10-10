<template>
  <div class="albums-container">
    <div
      class="album-container"
      v-masonry
      transition-duration="0.3s"
      item-selector=".item"
    >
      <Photo
        v-for="photo in photoList"
        :photo="photo"
        class="item"
        v-masonry-tile
        @click="showphotoDetail(photo)"
      ></Photo>
    </div>
    <PhotoDetail
      :photo="selectPhoto"
      v-if="selectPhoto"
      @close="selectPhoto = null"
    ></PhotoDetail>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Photo from "../components/Photo.vue";
import photo from "../api/photo";
import type { PhotoType } from "../types/photo";
import PhotoDetail from "../components/PhotoDetail.vue";
const photoList = ref();
const selectPhoto = ref();
const getPhotoList = () => {
  photo.getAllPhotos().then((res) => {
    if (res.status === 200) {
      photoList.value = res.data.data;
    }
  });
};
const showphotoDetail = (data: PhotoType) => {
  selectPhoto.value = data;
};
onMounted(() => {
  getPhotoList();
});
</script>

<style scoped lang="less">
.album-container {
  margin: 0 auto;
}
.item {
  width: calc(33.33% - 16px); // 三列布局，每列减去间距
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
