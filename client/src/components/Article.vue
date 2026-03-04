<template>
  <div class="article-container">
    <img :src="articleData.url" class="cover" />
    <div class="meta">
      <router-link :to="`/article/${articleData.id}`" class="title">
        {{ articleData.title }}</router-link
      >
      <p class="excerpt">{{ articleData.excerpt }}</p>
      <ul class="tags">
        <li class="tag" v-for="tag in articleData.tags">{{ tag }}</li>
      </ul>
      <div class="create-time">
        {{ dayjs(articleData.createAt).format("YYYY年MM月DD日") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import type { ArticleRaw } from "../types/article";
defineProps<{ articleData: ArticleRaw }>();
</script>
<style scoped lang="less">
@import "../style/theme.less";
.article-container {
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  overflow: hidden;
  display: flex;
  user-select: none;
  max-height: fit-content;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease;

  .cover {
    width: 48%;
    min-height: 210px;
    max-height: 320px;
    object-fit: cover;
    flex-shrink: 0;
    transition: transform 0.28s ease;
  }
  .meta {
    min-width: 0;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    .title {
      width: fit-content;
      display: inline-block;
      font-size: 22px;
      font-weight: 700;
      position: relative;
      color: var(--text-color);
      &::after {
        content: "";
        width: 100%;
        position: absolute;
        height: 2px;
        background-color: var(--primary-color);
        left: 0;
        bottom: -4px;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 0.2s ease;
      }
      &:hover::after {
        transform: scaleX(1);
      }
      &:hover {
        color: var(--primary-color);
      }
    }

    .excerpt {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.75;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: auto;

      .tag {
        border: 1px solid color-mix(in srgb, var(--primary-color) 28%, var(--line-color));
        background: color-mix(in srgb, var(--primary-weak) 76%, transparent);
        border-radius: 999px;
        padding: 2px 10px;
        color: var(--primary-color);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }
    }

    .create-time {
      margin-top: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: default;
    }
  }

  &:hover {
    transform: translateY(-3px);
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--line-color));
    box-shadow: 0 14px 28px color-mix(in srgb, var(--shadow-color) 90%, transparent);
    .cover {
      transform: scale(1.03);
    }
  }
}
@media (max-width: 960px) {
  .article-container {
    .meta {
      padding: 16px 18px;
      .title {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 768px) {
  .article-container {
    flex-direction: column;
    .cover {
      width: 100%;
      min-height: 180px;
      max-height: 250px;
    }
    .meta {
      gap: 10px;
      .excerpt {
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
