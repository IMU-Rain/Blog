<template>
  <div class="albums-container">
    <div class="albums-container-midden">
      <div
        class="album-container"
        v-masonry
        transition-duration="0.3s"
        item-selector=".item"
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
import photo from "../api/photo";
import PhotoDetail from "../components/PhotoDetail.vue";
const photoList = ref();
const selectPhoto = ref();
const index = ref();
const getPhotoList = () => {
  photo.getAllPhotos().then((res) => {
    if (res.status === 200) {
      photoList.value = res.data.data;
    }
  });
};
const showphotoDetail = (selectIndex: number) => {
  selectPhoto.value = photoList.value[selectIndex];
  index.value = selectIndex;
};
const switchPhoto = (index: number) => {
  if (index === -1 || index === photoList.value.length) {
    return;
  }
  showphotoDetail(index);
};
onMounted(() => {
  getPhotoList();
});
</script>

<style scoped lang="less">
.albums-container {
  max-width: 100%;
  .albums-container-midden {
    margin: 0 auto;
    width: inherit;
  }
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
