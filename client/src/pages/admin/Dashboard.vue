<template>
  <div class="dashboard-container">
    <div class="card" v-if="dataLoading">
      <Datacard v-for="data in cardData" :data></Datacard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getArticles } from "../../api/article";
import Datacard from "../../components/admin/datacard.vue";
import { useRequest } from "../../hooks/useRequest";
import type { ArticleRaw } from "../../types/article";
import { getAllPhotos } from "../../api/photo";
const dataLoading = ref(false);
const { data: ArticleData, run: Articlerun } =
  useRequest<[ArticleRaw]>(getArticles);
const { data: PhotoData, run: Photorun } = useRequest(getAllPhotos);
const cardData = ref<Array<{ title: string; number: number; icon: string }>>(
  []
);
onMounted(() => {
  Articlerun()
    .then(() => {
      cardData.value?.push({
        title: "文章数",
        number: ArticleData.value?.length || 0,
        icon: "Odometer",
      });
      dataLoading.value = true;
    })
    .finally(() => {
      Photorun().then(() => {
        cardData.value?.push({
          title: "照片数",
          number: PhotoData.value?.length || 0,
          icon: "Picture",
        });
      });
    });
});
</script>

<style scoped lang="less">
.dashboard-container {
  padding: 100px;
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}
</style>
