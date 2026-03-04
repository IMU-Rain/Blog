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
import { onMounted } from "vue";
import { toAssetUrl } from "../hooks/url";
const {
  data: articles,
  error,
  loading,
  run,
} = useRequest<[ArticleRaw]>(getArticles);
onMounted(() => {
  run().then(() => {
    articles.value?.map((article) => {
      article.url = toAssetUrl(article.url);
    });
  });
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  display: grid;
  grid-template-columns: minmax(0, 11fr) minmax(270px, 4fr);
  gap: 24px;
  align-items: start;
  overflow: visible;
  .article-titles {
    display: flex;
    gap: 20px;
    flex-direction: column;
  }
}
@media (max-width: 960px) {
  .container {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>
