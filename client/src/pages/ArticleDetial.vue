<template>
  <div class="article-detail-container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div v-else class="article-detail">
      <img :src="articleData?.cover" class="cover-img" />
      <article
        v-html="md.render(articleData?.content || '')"
        class="article-detail-content"
      ></article>
      <span class="createAt"
        >写于&nbsp;{{ dayjs(articleData?.createAt).format("YYYY-MM-DD") }}</span
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
import { onMounted } from "vue";
import { toAssetUrl } from "../hooks/url";
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
onMounted(() => {
  run({ id: articleID }).then(() => {
    document.title = String(articleData.value?.title);
    if (articleData.value) {
      articleData.value.cover = toAssetUrl(articleData.value.cover);
    }
  });
});
</script>

<style lang="less">
@import "../style/theme.less";
.article-detail-container {
  display: grid;
  grid-template-columns: minmax(0, 11fr) minmax(270px, 4fr);
  gap: 24px;
  align-items: start;
  .article-detail {
    background: var(--surface-color);
    border: 1px solid var(--line-color);
    border-radius: 16px;
    box-shadow: 0 10px 22px var(--shadow-color);
    overflow: hidden;
    font-weight: 400;
    max-width: 1100px;

    .cover-img {
      width: 100%;
      max-height: 380px;
      object-fit: cover;
      border-bottom: 1px solid var(--line-color);
    }

    .article-detail-content {
      overflow-wrap: anywhere;
      color: var(--text-color);
      white-space: pre-wrap;
      padding: 22px 24px;
      width: 100%;
      font-size: 20px;
      line-height: 1.9;
      h1,
      h2,
      h3,
      h4 {
        color: var(--text-color);
        line-height: 1.4;
      }
      p,
      li {
        color: var(--text-muted);
      }
      a {
        color: var(--primary-color);
      }
      table {
        width: 100%;
        border: 1px solid var(--line-color);
        border-collapse: collapse;
        border-radius: 10px;
        overflow: hidden;
        th,
        td {
          border: 1px solid var(--line-color);
          text-align: center;
          padding: 8px 10px;
          color: var(--text-color);
        }
        th {
          color: var(--text-color);
          padding: 10px;
          background: color-mix(in srgb, var(--panel-color) 72%, transparent);
        }
      }
      pre {
        white-space: pre-wrap;
        color: var(--text-color);
        font-style: italic;
        border: 1px solid color-mix(in srgb, var(--line-color) 88%, transparent);
        border-radius: 12px;
        padding: 12px 14px;
        background: color-mix(in srgb, var(--panel-color) 66%, transparent);
        overflow: auto;
      }
      blockquote {
        margin: 16px 0;
        padding: 10px 14px;
        border-left: 4px solid var(--primary-color);
        border-radius: 10px;
        background: color-mix(in srgb, var(--panel-color) 72%, transparent);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      ul,
      ol {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-left: 20px;
      }
      li {
        li {
          padding-left: 20px;
        }
      }
      .hljs {
        border-radius: 12px;
        padding: 14px 16px;
        color: var(--text-color);
      }
    }
    .createAt {
      padding: 0 24px 22px;
      color: var(--text-muted);
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-align: right;
      display: block;
    }
  }
}
@media (max-width: 960px) {
  .article-detail-container {
    grid-template-columns: 1fr;
    .article-detail {
      max-width: 100%;
      .cover-img {
        max-height: 260px;
      }
      .createAt {
        padding: 0 16px 16px;
      }
      .article-detail-content {
        padding: 16px;
        font-size: 17px;
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
