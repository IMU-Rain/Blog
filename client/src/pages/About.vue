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

import getAbout from "../api/about";
import MarkdownIt from "markdown-it";
import { useRequest } from "../hooks/useRequest";
import LoadingSkeleton from "../components/LoadingSkeleton.vue";
import ErrorSkeleton from "../components/ErrorSkeleton.vue";
import { onMounted } from "vue";
const md = new MarkdownIt();

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
  grid-template-columns: 11fr 4fr;
  gap: 30px;
  .about {
    width: 100%;
    padding: 20px;
    background-color: @card-background-color;
    color: @text-color;
    transition: height 100s ease;
    .about-article {
      color: @accent-color;
      h1 {
        border-bottom: 2px solid @accent-color;
        display: block;
        width: fit-content;
        margin-bottom: 10px;
      }
    }
  }
}
@media (max-width: 768px) {
  .about-container {
    grid-template-columns: 1fr;
    min-width: 90vw;
  }
}
@media (prefers-color-scheme: dark) {
  .about-container {
    .about {
      background-color: @dark-card-background-color;
      .about-article {
        color: @dark-accent-color;
        h1 {
          border-bottom: 2px solid @dark-accent-color;
        }
      }
    }
  }
}
</style>
