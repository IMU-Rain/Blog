<template>
  <aside class="comment-aside">
    <div class="comment-header">
      <h3>评论</h3>
      <span>{{ comments.length }}</span>
    </div>

    <form class="comment-form" @submit.prevent="submitComment">
      <textarea
        v-model="draft"
        maxlength="1000"
        rows="3"
        placeholder="写下你的想法"
      ></textarea>
      <div class="comment-actions">
        <span class="form-message" :class="{ error: Boolean(formError) }">
          {{ formError || `${draft.length}/1000` }}
        </span>
        <button type="submit" :disabled="submitting || !draft.trim()">
          {{ submitting ? "发布中" : "发布" }}
        </button>
      </div>
    </form>

    <div v-if="loading" class="comment-state">评论加载中...</div>
    <div v-else-if="loadError" class="comment-state error">
      {{ loadError }}
    </div>
    <div v-else-if="comments.length === 0" class="comment-state">
      暂无评论
    </div>
    <ul v-else class="comment-list">
      <li v-for="comment in comments" :key="comment._id" class="comment-item">
        <div class="avatar">
          {{ getAuthorName(comment).slice(0, 1).toUpperCase() }}
        </div>
        <div class="comment-main">
          <div class="comment-meta">
            <span class="author">{{ getAuthorName(comment) }}</span>
            <time>{{ formatTime(comment.createAt) }}</time>
          </div>
          <p>{{ comment.content }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import axios from "axios";
import dayjs from "dayjs";
import { onMounted, ref, watch } from "vue";
import { createComment, getComments } from "../api/comment";
import { useUserStore } from "../store/user";
import type { CommentItem, CommentTargetType } from "../types/comment";

const props = defineProps<{
  targetType: CommentTargetType;
  targetId: string;
}>();

const userStore = useUserStore();
const comments = ref<CommentItem[]>([]);
const draft = ref("");
const loading = ref(false);
const submitting = ref(false);
const loadError = ref("");
const formError = ref("");

const formatTime = (time: string) => {
  return dayjs(time).format("MM-DD HH:mm");
};

const getAuthorName = (comment: CommentItem) => {
  return comment.author?.nickname || comment.author?.username || "匿名";
};

const loadComments = async () => {
  if (!props.targetId) return;
  loading.value = true;
  loadError.value = "";
  try {
    comments.value = await getComments({
      targetType: props.targetType,
      targetId: props.targetId,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      loadError.value = err.response?.data?.detail || "评论加载失败";
      return;
    }
    loadError.value = "评论加载失败";
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  const content = draft.value.trim();
  if (!content || submitting.value) return;
  if (!userStore.isLogged) {
    formError.value = "请先登录后评论";
    userStore.openLoginModal();
    return;
  }
  submitting.value = true;
  formError.value = "";
  try {
    const comment = await createComment({
      targetType: props.targetType,
      targetId: props.targetId,
      content,
    });
    comments.value = [...comments.value, comment];
    draft.value = "";
  } catch (err) {
    if (axios.isAxiosError(err)) {
      formError.value = err.response?.data?.detail || "评论发布失败";
      if (err.response?.status === 401) {
        userStore.clearUser();
        userStore.openLoginModal();
      }
      return;
    }
    formError.value = "评论发布失败";
  } finally {
    submitting.value = false;
  }
};

onMounted(loadComments);

watch(
  () => [props.targetType, props.targetId],
  () => {
    draft.value = "";
    formError.value = "";
    loadComments();
  },
);
</script>

<style scoped lang="less">
@import "../style/theme.less";

.comment-aside {
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  padding: 16px;
  color: var(--text-color);

  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 16px;
      line-height: 1.3;
    }

    span {
      min-width: 28px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: var(--primary-weak);
      font-size: 13px;
      font-weight: 700;
    }
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;

    textarea {
      width: 100%;
      min-height: 82px;
      resize: vertical;
      border: 1px solid var(--line-color);
      border-radius: 12px;
      padding: 10px 12px;
      color: var(--text-color);
      background: color-mix(in srgb, var(--panel-color) 42%, var(--surface-color));
      outline: none;
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

      &:focus {
        border-color: color-mix(
          in srgb,
          var(--primary-color) 58%,
          var(--line-color)
        );
        box-shadow: 0 0 0 3px var(--primary-weak);
      }

      &::placeholder {
        color: var(--text-muted);
      }
    }
  }

  .comment-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .form-message {
      min-width: 0;
      color: var(--text-muted);
      font-size: 12px;
      overflow-wrap: anywhere;

      &.error {
        color: #c64545;
      }
    }

    button {
      flex: 0 0 auto;
      min-width: 62px;
      height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      color: var(--surface-color);
      background: var(--primary-color);
      cursor: pointer;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  .comment-state {
    padding: 14px 0;
    color: var(--text-muted);
    font-size: 14px;
    text-align: center;

    &.error {
      color: #c64545;
    }
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .comment-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 10px;
  }

  .avatar {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--surface-color);
    background: color-mix(in srgb, var(--primary-color) 86%, var(--text-color));
    font-size: 14px;
    font-weight: 800;
  }

  .comment-main {
    min-width: 0;

    .comment-meta {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;

      .author {
        min-width: 0;
        color: var(--text-color);
        font-size: 14px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      time {
        flex: 0 0 auto;
        color: var(--text-muted);
        font-size: 12px;
      }
    }

    p {
      margin: 0;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.65;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }
  }
}
</style>
