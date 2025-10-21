<template>
  <div class="article-detail-container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div v-else class="article-detail">
      <img :src="articleData?.url" class="cover-img" />
      <h1 class="article-title">{{ articleData?.article.title }}</h1>
      <span class="createAt">{{
        dayjs(articleData?.article.createAt).format("YYYY-MM-DD")
      }}</span>
      <article
        v-html="md.render(articleData?.article.content || '')"
        class="article-detail-content"
      ></article>
    </div>
    <Aside></Aside>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { getArticleDetail } from "../api/article";
import Aside from "../components/Aside.vue";
import MarkdownIt from "markdown-it";
import dayjs from "dayjs";
import { useRequest } from "../hooks/useRequest";
import type { ArticleDetail } from "../types/article";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
const md = new MarkdownIt();
const route = useRoute();
const articleID = String(route.params.id);
const {
  data: articleData,
  error,
  run,
  loading,
} = useRequest<ArticleDetail>(getArticleDetail);
run({ id: articleID });
</script>

<style lang="less">
@import "../style/theme.less";
.article-detail-container {
  display: grid;
  grid-template-columns: 11fr 4fr;
  gap: 30px;
  .article-detail {
    background-color: @card-background-color;
    font-weight: 400;
    max-width: 1100px;
    text-wrap: wrap;
    .article-title {
      padding: 0 24px;
    }
    .cover-img {
      width: 100%;
      max-height: 350px;
      object-fit: cover;
    }
    .createAt {
      padding: 0 24px;
      color: @accent-color;
    }
    .article-detail-content {
      overflow: wrap;
      box-sizing: border-box;
      color: @primary-color;
      white-space: pre-wrap;
      padding: 0 24px;
      width: 100%;
      font-size: 22px;
      font-weight: 500;
      pre {
        white-space: pre-wrap;
        color: @accent-color;
        font-style: italic;
      }
    }
  }
}
@media (max-width: 768px) {
  .article-detail-container {
    grid-template-columns: 1fr;
    max-width: 99vw;
    overflow: hidden;
    .article-detail {
      max-width: 100vw;
      .cover-img {
        max-width: 100vw;
      }
      .article-title {
        padding: 10px;
      }
      .createAt {
        padding: 10px;
      }
      .article-detail-content {
        padding: 10px;
        img {
          max-width: 100vw;
        }
      }
    }
  }
}
@media (prefers-color-scheme: dark) {
  .article-detail-container {
    .article-detail {
      background-color: @dark-card-background-color;
      .createAt {
        color: @dark-accent-color;
      }
      .article-detail-content {
        font-size: 18px;
        color: @dark-primary-color;
        pre {
          color: @dark-accent-color;
        }
      }
    }
  }
}
</style>
