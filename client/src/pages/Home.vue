<template>
  <div class="container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div class="article-titles" v-else>
      <Article v-for="article in articles" :articleData="article"></Article>
    </div>
    <Aside></Aside>
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
