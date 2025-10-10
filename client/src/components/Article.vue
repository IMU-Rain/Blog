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
import type { Articles } from "../types/article";
defineProps<{ articleData: Articles }>();
</script>
<style scoped lang="less">
@import "../style/theme.less";
.article-container {
  background-color: @card-background-color;
  overflow: hidden;
  display: flex;
  max-height: fit-content;
  .cover {
    background-color: transparent;
    width: 60%;
    max-height: 300px;
    object-fit: cover;
    display: inline-block;
  }
  .meta {
    height: 100%;
    padding: 14px;
    padding-left: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    .title {
      font-size: 20px;
      font-weight: 700;
      position: relative;
      color: @primary-color;
      width: fit-content;
      display: inline-block;
      &::after {
        content: "";
        width: 100%;
        position: absolute;
        height: 3px;
        background-color: @accent-color;
        left: 0;
        bottom: -5px;
        transform: scale(0);
        transition: all 0.3s ease;
        transform-origin: left center;
      }
      &:hover::after {
        transform: scale(1);
      }
      &:hover {
        color: @accent-color;
      }
    }

    .tags {
      display: flex;
      gap: 15px;

      .tag {
        background-color: @accent-color;
        border-radius: 5px;
        padding: 3px 5px;
        color: @card-background-color;
        cursor: pointer;
      }
      .create-time {
        font-weight: 300;
        font-size: 16px;
        color: #999;
        cursor: default;
      }
    }
  }
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }
}
@media (max-width: 768px) {
  .article-container {
    flex-direction: column;
    .cover {
      width: 100%;
    }
    .meta {
      gap: 5px;
      .excerpt {
        display: none;
      }
    }
  }
}
@media (prefers-color-scheme: dark) {
  .article-container {
    background-color: @dark-card-background-color;
    .meta {
      .title {
        color: @dark-primary-color;
        &:hover {
          color: @dark-accent-color;
        }
        &::after {
          background-color: @dark-primary-color;
        }
        &:hover::after {
          background-color: @dark-accent-color;
        }
      }
    }
  }
}
</style>
