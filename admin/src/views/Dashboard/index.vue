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
      <ViewerMap class="map" />
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  width: min(1260px, 94vw);
  margin: 0 auto;
  min-height: calc(100vh - 170px);
  color: var(--text-color);
  .solgan {
    h2,
    h4 {
      color: var(--text-color);
    }

    h4 {
      color: var(--text-muted);
    }
  }

  .content {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .cards {
      display: grid;
      min-height: 104px;
      gap: 12px;
      grid-template-columns: repeat(4, 1fr);
      .card {
        transition: 0.2s;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    .map {
      width: 100%;
      height: clamp(300px, 44vh, 420px);
    }
  }
}

@media (max-width: 1024px) {
  .container {
    .content {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .map {
        height: clamp(280px, 40vh, 380px);
      }
    }
  }
}

@media (max-width: 640px) {
  .container {
    .content {
      margin-top: 1rem;

      .cards {
        grid-template-columns: 1fr;
      }

      .map {
        height: 300px;
      }
    }
  }
}
</style>
