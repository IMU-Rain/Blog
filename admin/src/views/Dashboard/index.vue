<script lang="ts" setup>
import { onMounted, ref } from "vue";
import DataCard from "./components/DataCard.vue";
import { getArticleNumber } from "@/api/DataCard";
const cardData = ref();
const setTableCard = async () => {
  getArticleNumber().then((res) => {
    cardData.value.push({ total: res.total });
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
      gap: 5%;
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
