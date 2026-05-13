<template>
  <div class="article-detail-container">
    <LoadingSkeleton v-if="loading" />
    <ErrorSkeleton v-else-if="error" />
    <div v-else class="article-detail">
      <div class="cover-wrap">
        <img :src="articleData?.cover" class="cover-img" />
      </div>
      <header class="article-hero">
        <div class="article-meta">
          <time>{{ dayjs(articleData?.createAt).format("YYYY-MM-DD") }}</time>
          <span v-if="articleData?.tags?.length">{{ articleData.tags.length }} 个标签</span>
        </div>
        <h1>{{ articleData?.title }}</h1>
        <ul v-if="articleData?.tags?.length" class="tag-list">
          <li v-for="tag in articleData.tags" :key="tag">{{ tag }}</li>
        </ul>
      </header>
      <ArticleExpert :content="articleData?.excerpt" />
      <article
        v-html="md.render(articleData?.content || '')"
        class="article-detail-content"
      ></article>
    </div>
    <Aside
      target-type="article"
      :target-id="articleID"
      :toc="articleData?.toc"
      :content="articleData?.content"
    ></Aside>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { getArticleDetail } from "../api/article";
import ArticleExpert from "../components/ArticleExpert.vue";
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
  grid-template-columns: minmax(0, 1fr) minmax(270px, 360px);
  gap: 24px;
  align-items: start;
  .article-detail {
    background: var(--surface-color);
    border: 1px solid var(--line-color);
    border-radius: 18px;
    box-shadow: 0 14px 32px color-mix(in srgb, var(--shadow-color) 82%, transparent);
    overflow: hidden;
    font-weight: 400;
    max-width: 920px;
    width: 100%;
    justify-self: center;

    .cover-wrap {
      width: 100%;
      aspect-ratio: 16 / 7;
      min-height: 260px;
      max-height: 430px;
      overflow: hidden;
      border-bottom: 1px solid var(--line-color);
      background: var(--panel-color);
    }

    .cover-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .article-hero {
      padding: 30px 42px 8px;

      .article-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 700;

        span,
        time {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
        }
      }

      h1 {
        margin: 10px 0 14px;
        color: var(--text-color);
        font-size: 34px;
        line-height: 1.25;
        font-weight: 850;
        letter-spacing: 0;
        overflow-wrap: anywhere;
      }

      .tag-list {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        li {
          padding: 4px 10px;
          border: 1px solid color-mix(in srgb, var(--primary-color) 20%, var(--line-color));
          border-radius: 999px;
          color: var(--primary-color);
          background: var(--primary-weak);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }
      }
    }

    .article-expert {
      margin: 18px 42px 0;
    }

    .article-detail-content {
      overflow-wrap: anywhere;
      color: var(--text-color);
      white-space: pre-wrap;
      padding: 28px 42px 36px;
      width: 100%;
      font-size: 18px;
      line-height: 1.92;
      letter-spacing: 0;
      word-break: normal;

      h1,
      h2,
      h3,
      h4 {
        color: var(--text-color);
        line-height: 1.35;
        font-weight: 800;
        letter-spacing: 0;
        scroll-margin-top: 112px;
      }
      h1 {
        margin: 28px 0 14px;
        font-size: 30px;
      }
      h2 {
        margin: 26px 0 12px;
        font-size: 25px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--line-color);
      }
      h3 {
        margin: 22px 0 10px;
        font-size: 21px;
      }
      h4 {
        margin: 18px 0 8px;
        font-size: 18px;
      }
      p,
      li {
        color: var(--text-muted);
      }
      p {
        margin: 0 0 18px;
      }
      a {
        color: var(--primary-color);
        font-weight: 700;
      }
      img {
        display: block;
        max-width: 100%;
        margin: 22px auto;
        border-radius: 12px;
        box-shadow: 0 10px 24px var(--shadow-color);
      }
      table {
        width: 100%;
        margin: 20px 0;
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
        margin: 20px 0;
        white-space: pre-wrap;
        color: var(--text-color);
        border: 1px solid color-mix(in srgb, var(--line-color) 88%, transparent);
        border-radius: 12px;
        padding: 14px 16px;
        background: color-mix(in srgb, var(--panel-color) 66%, transparent);
        overflow: auto;
      }
      blockquote {
        margin: 20px 0;
        padding: 12px 16px;
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
        gap: 6px;
        margin: 0 0 18px;
        padding-left: 22px;
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
  }
}
@media (max-width: 960px) {
  .article-detail-container {
    grid-template-columns: 1fr;
    .article-detail {
      max-width: 100%;
      .cover-wrap {
        aspect-ratio: 4 / 3;
        min-height: 0;
        max-height: 300px;
      }
      .article-hero {
        padding: 22px 18px 6px;

        h1 {
          font-size: 26px;
          line-height: 1.3;
        }
      }
      .article-expert {
        margin: 14px 18px 0;
      }
      .article-detail-content {
        padding: 22px 18px 28px;
        font-size: 16.5px;
        line-height: 1.85;

        h1 {
          font-size: 25px;
        }

        h2 {
          font-size: 22px;
        }

        h3 {
          font-size: 19px;
        }
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
