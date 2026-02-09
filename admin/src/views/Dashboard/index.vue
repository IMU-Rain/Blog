<script lang="ts" setup>
import { onMounted, ref } from "vue";
import DataCard from "./components/DataCard.vue";
import {
  getArticleNumber,
  getDuxiuIndex,
  getPhotoNumber,
  getViewerNumber,
} from "@/api/DataCard";
import ViewerMap from "./components/ViewerMap.vue";
const cardData = ref<
  { number: number; title: string; icon: string; color: string }[]
>([]);
const setTableCard = async () => {
  await getArticleNumber().then((res) => {
    cardData.value.push({
      number: res.total as number,
      title: "文章数量",
      icon: "grommet-icons:book",
      color: "#dee2e6",
    });
  });
  await getViewerNumber().then((res) => {
    cardData.value.push({
      number: res.total as number,
      title: "浏览量",
      icon: "hugeicons:view",
      color: "2",
    });
  });
  await getPhotoNumber().then((res) => {
    cardData.value.push({
      number: res.total as number,
      title: "照片数量",
      icon: "lineicons:photos",
      color: "2",
    });
  });
  await getDuxiuIndex().then((res) => {
    cardData.value.push({
      number: res.data[res.data.length - 1].duxiuIndex as number,
      title: "独秀指数",
      icon: "qlementine-icons:money-16",
      color: "2",
    });
  });
};
onMounted(() => {
  setTableCard();
});
</script>

<template>
  <div class="container">
    <div class="solgan">
      <h2>Welcome Back! 👏</h2>
      <h4>Hows Your Day</h4>
    </div>
    <div class="content">
      <ul class="cards">
        <li class="card" v-for="item in cardData"><DataCard :meta="item" /></li>
      </ul>
      <ViewerMap />
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  width: 70%;
  margin: 0 auto;
  .content {
    margin-top: 2rem;
    .cards {
      display: grid;
      height: 120px;
      gap: 2%;
      grid-template-columns: repeat(4, 1fr);
      .card {
        transition: 0.2s;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
</style>
