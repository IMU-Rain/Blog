<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { MdEditor, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import MaxButton from "@/components/MaxButton.vue";
import { getAbout, updateAbout } from "@/api/about";
import MaxMessage from "@/components/MaxMessage";

interface AboutRecord {
  _id?: string;
  content: string;
  createAt?: string;
}

const router = useRouter();
const isLoading = ref(false);
const isSaving = ref(false);
const aboutId = ref("");
const markdown = ref("");
const updatedAt = ref("");

const editorId = "about-editor-preview";
const wordCount = computed(() => markdown.value.trim().length);
const lineCount = computed(() =>
  markdown.value ? markdown.value.split("\n").length : 0,
);

const defaultTemplate = `# 关于我

你好，我是 **Max Byte**。

## 技术方向

- 前端工程化与性能优化
- Node.js 与服务端架构


> 这里可以继续补充你的经历、技能栈与合作方式。`;

// 将服务端时间统一格式化为本地可读时间
const toDateText = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

// 初始化加载：优先读取数据库内容，404 时回退到默认模板
const loadAbout = async () => {
  isLoading.value = true;
  try {
    const res = await getAbout();
    if (res.code === 200 && res.data) {
      const record = res.data as AboutRecord;
      aboutId.value = String(record._id || "");
      markdown.value = record.content || defaultTemplate;
      updatedAt.value = toDateText(record.createAt);
    }
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404) {
      markdown.value = defaultTemplate;
      updatedAt.value = "--";
      return;
    }
    console.error(error);
    MaxMessage({
      message: "关于页内容加载失败，请稍后重试",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
  } finally {
    isLoading.value = false;
  }
};

// 保存关于页：仅允许非空内容，成功后同步更新时间
const saveAbout = async () => {
  if (isSaving.value) return;
  if (!markdown.value.trim()) {
    MaxMessage({
      message: "内容不能为空",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
    return;
  }
  isSaving.value = true;
  try {
    const res = await updateAbout(markdown.value);
    if (res.code === 200) {
      const record = (res.data || {}) as AboutRecord;
      aboutId.value = String(record._id || aboutId.value);
      updatedAt.value = toDateText(record.createAt || new Date().toISOString());
      MaxMessage({
        message: "关于页保存成功",
        icon: "mdi:check-circle-outline",
        color: "#2f7ccf",
      });
    }
  } catch (error) {
    console.error(error);
    MaxMessage({
      message: "保存失败，请稍后重试",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
  } finally {
    isSaving.value = false;
  }
};

// 页面挂载时自动拉取数据
onMounted(() => {
  loadAbout();
});
</script>

<template>
  <div class="about-page">
    <div class="header-card">
      <div class="title-wrap">
        <h2>关于页编辑</h2>
        <p>
          <span>最后更新：{{ updatedAt }}</span>
          <span>字数：{{ wordCount }}</span>
          <span>行数：{{ lineCount }}</span>
        </p>
      </div>
      <div class="actions">
        <MaxButton
          icon="icon-park-outline:left"
          height="16"
          color="#4f86d8"
          @click="router.push('/Dashboard')"
        >
          返回首页
        </MaxButton>
        <MaxButton
          icon="icon-park-outline:save"
          height="16"
          color="#2f7ccf"
          :disabled="isSaving || isLoading"
          @click="saveAbout"
        >
          {{ isSaving ? "保存中..." : "保存内容" }}
        </MaxButton>
      </div>
    </div>

    <section v-if="isLoading" class="loading-card">正在加载关于页内容...</section>

    <section v-else class="content-grid">
      <article class="editor-card">
        <div class="card-head">
          <h3>Markdown 编辑区</h3>
          <span>ID: {{ aboutId || "未创建" }}</span>
        </div>
        <MdEditor
          v-model="markdown"
          class="md-editor-panel"
          :preview="false"
          language="zh-CN"
        />
      </article>

      <article class="preview-card">
        <div class="card-head">
          <h3>实时预览</h3>
          <span>展示效果</span>
        </div>
        <div class="preview-body">
          <MdPreview :editorId="editorId" :modelValue="markdown" />
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped lang="less">
.about-page {
  width: min(1280px, 95vw);
  margin: 8px auto 0;
  padding-bottom: 30px;
  color: var(--text-color);
}

.header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid var(--line-color);
  background:
    radial-gradient(
      70% 160% at 0% 0%,
      color-mix(in srgb, var(--primary-color) 12%, transparent),
      transparent 64%
    ),
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--surface-color) 95%, transparent),
      color-mix(in srgb, var(--panel-color) 82%, transparent)
    );
  box-shadow: 0 10px 24px color-mix(in srgb, var(--shadow-color) 78%, transparent);
}

.title-wrap {
  h2 {
    margin: 0;
    font-size: 24px;
    letter-spacing: 0.4px;
  }

  p {
    margin: 7px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    color: var(--text-muted);
    font-size: 13px;
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  :deep(.button-container) {
    border-width: 1px;
    border-radius: 999px;
    min-height: 34px;
    padding: 8px 14px;
  }
}

.loading-card {
  margin-top: 14px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--line-color);
  text-align: center;
  color: var(--text-muted);
  background: var(--surface-color);
}

.content-grid {
  margin-top: 14px;
  min-height: calc(100vh - 220px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.editor-card,
.preview-card {
  border-radius: 16px;
  border: 1px solid var(--line-color);
  background: var(--surface-color);
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--shadow-color) 68%, transparent);
}

.card-head {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line-color);
  background: color-mix(in srgb, var(--panel-color) 70%, transparent);

  h3 {
    margin: 0;
    font-size: 14px;
  }

  span {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.md-editor-panel {
  height: 100%;
  min-height: 560px;
}

.preview-body {
  padding: 14px 16px;
  min-height: 560px;
  overflow: auto;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--surface-color) 98%, transparent),
    color-mix(in srgb, var(--panel-color) 62%, transparent)
  );
}

:deep(.md-editor) {
  height: 100%;
}

:deep(.md-editor-preview-wrapper) {
  padding-top: 2px;
}

@media (max-width: 1080px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .md-editor-panel,
  .preview-body {
    min-height: 420px;
  }
}

@media (max-width: 760px) {
  .header-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
