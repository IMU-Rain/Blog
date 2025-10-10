<template>
  <div class="container">
    <div class="article-titles" v-if="articles">
      <Article v-for="article in articles" :articleData="article"></Article>
    </div>
    <Aside></Aside>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Article from "../components/Article.vue";
import Aside from "../components/Aside.vue";
import article from "../api/article";
const articles = ref();
const getArtiles = () => {
  article.getArticles().then((res) => {
    if (res.status === 200) {
      articles.value = res.data;
    }
  });
};

onMounted(() => {
  getArtiles();
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  display: grid;
  grid-template-columns: 11fr 4fr;
  gap: 30px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100vw;
  }
  .article-titles {
    display: flex;
    gap: 30px;
    flex-direction: column;
  }
}
</style>
