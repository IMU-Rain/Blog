<template>
  <div class="aside">
    <PoemAside />
    <ArticleToc v-if="toc || content" :toc="toc" :content="content" />
    <CommentAside
      v-if="targetType && targetId"
      :target-type="targetType"
      :target-id="targetId"
    />
    <DuxiuIndexAside />
  </div>
</template>

<script lang="ts" setup>
import type { CommentTargetType } from "../types/comment";
import ArticleToc from "./ArticleToc.vue";
import CommentAside from "./CommentAside.vue";
import DuxiuIndexAside from "./DuxiuIndexAside.vue";
import PoemAside from "./PoemAside.vue";

defineProps<{
  targetType?: CommentTargetType;
  targetId?: string;
  toc?: string;
  content?: string;
}>();
</script>

<style scoped lang="less">
.aside {
  position: sticky;
  top: 104px;
  max-height: calc(100vh - 124px);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-right: 2px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
}

@media (max-width: 960px) {
  .aside {
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}
</style>
