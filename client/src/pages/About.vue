<template>
  <div class="about-container">
    <div class="about">
      <LoadingSkeleton v-if="loading" />
      <ErrorSkeleton v-else-if="error" />
      <article
        v-else-if="aboutData && aboutData.content"
        v-html="md.render(aboutData.content)"
        class="about-article"
      ></article>
    </div>
    <Aside></Aside>
  </div>
</template>

<script lang="ts" setup>
import Aside from "../components/Aside.vue";

import MarkdownIt from "markdown-it";
import { useRequest } from "../hooks/useRequest";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import { onMounted } from "vue";
import { getAbout } from "../api/about";
const md = new MarkdownIt();
console.log(import.meta.env);
const { loading, error, data: aboutData, run } = useRequest(getAbout);
onMounted(() => {
  run();
});
</script>

<style lang="less">
@import "../style/theme.less";
.about-container {
  overflow: visible;
  display: grid;
  grid-template-columns: minmax(0, 11fr) minmax(270px, 4fr);
  gap: 24px;
  align-items: start;
  .about {
    width: 100%;
    padding: 24px;
    background: var(--surface-color);
    border: 1px solid var(--line-color);
    border-radius: 16px;
    box-shadow: 0 10px 22px var(--shadow-color);
    color: var(--text-color);
    .about-article {
      color: var(--text-color);
      line-height: 1.85;

      h1 {
        border-bottom: 1px solid var(--line-color);
        display: block;
        width: fit-content;
        margin: 0 0 14px;
        padding-bottom: 8px;
      }
      h2,
      h3 {
        margin: 18px 0 12px;
      }
      p,
      li {
        color: var(--text-muted);
      }
      a {
        color: var(--primary-color);
      }
      blockquote {
        margin: 16px 0;
        padding: 10px 14px;
        border-left: 4px solid var(--primary-color);
        border-radius: 10px;
        background: color-mix(in srgb, var(--panel-color) 72%, transparent);
      }
      pre {
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid var(--line-color);
        background: color-mix(in srgb, var(--panel-color) 66%, transparent);
        overflow-x: auto;
      }
    }
  }
}
@media (max-width: 960px) {
  .about-container {
    grid-template-columns: 1fr;
    .about {
      padding: 18px;
    }
  }
}
</style>
