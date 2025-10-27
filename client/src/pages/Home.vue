<template>
  <div class="container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div class="article-titles" v-else>
      <Article v-for="article in articles" :articleData="article"></Article>
    </div>
    <div class="aside">
      <Aside></Aside>
      <DuxiuIndexAside />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Article from "../components/Article.vue";
import Aside from "../components/Aside.vue";
import { getArticles } from "../api/article";
import { useRequest } from "../hooks/useRequest";
import type { ArticleRaw } from "../types/article";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import DuxiuIndexAside from "../components/DuxiuIndexAside.vue";
const {
  data: articles,
  error,
  loading,
} = useRequest<[ArticleRaw]>(getArticles, {
  immediate: true,
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  display: grid;
  grid-template-columns: 11fr 4fr;
  gap: 30px;
  overflow: visible;
  .aside {
    grid-area: aside;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .article-titles {
    grid-area: articles;
    display: flex;
    gap: 30px;
    flex-direction: column;
  }
}
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "aside"
      "articles";
    width: 100vw;
  }
}
</style>
