<template>
  <div class="article-detail-container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div v-else class="article-detail">
      <img :src="articleData?.url" class="cover-img" />
      <article
        v-html="md.render(articleData?.article.content || '')"
        class="article-detail-content"
      ></article>
      <span class="createAt"
        >写于&nbsp;{{
          dayjs(articleData?.article.createAt).format("YYYY-MM-DD")
        }}</span
      >
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
import anchor from "markdown-it-anchor";
import toc from "markdown-it-table-of-contents";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import taskLists from "markdown-it-task-lists";
import markdownItAttrs from "markdown-it-attrs";
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    // 没指定语言或出错时的默认高亮
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
});
md.use(anchor);
md.use(toc, {
  includeLevel: [1, 2, 3],
  containerClass: "table-of-contents",
  markerPattern: /^\[toc\]/im,
});
md.use(taskLists, { enabled: true, label: true, labelAfter: false });
md.use(markdownItAttrs);
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
    .article-detail-content {
      overflow: wrap;
      box-sizing: border-box;
      color: @primary-color;
      white-space: pre-wrap;
      padding: 0 24px;
      width: 100%;
      font-size: 22px;
      font-weight: 500;
      table {
        width: 100%;
        th,
        td {
          border: 1px solid #000;
          text-align: center;
          padding: 5px 0;
          color: @accent-color;
        }
        th {
          color: @primary-color;
          padding: 10px 0;
        }
        border-collapse: collapse;
      }
      pre {
        white-space: pre-wrap;
        color: @accent-color;
        font-style: italic;
      }
      blockquote {
        padding-left: 20px;
        border-left: 4px solid rgba(120, 120, 120, 0.3);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      ul {
        display: flex;
        flex-direction: column;
      }
      li {
        li {
          padding-left: 20px;
        }
      }
      ol {
        display: flex;
        flex-direction: column;
      }
      .hljs {
        border-radius: 15px;
        padding: 10px 20px;
        color: @dark-primary-color;
      }
    }
    .createAt {
      padding: 0 24px;
      color: @accent-color;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: right;
      display: block;
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
