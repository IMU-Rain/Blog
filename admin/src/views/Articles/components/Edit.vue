<script lang="ts" setup>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import MaxButton from "@/components/MaxButton.vue";
import MaxInput from "@/components/MaxInput.vue";
import http from "@/api/http";
import {
  createArticle,
  createExpert,
  getArticleDetail,
  updateArticle,
} from "@/api/Articles";
import { useRoute, useRouter } from "vue-router";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { uploadFile } from "@/api/File";

type ArticleStatus = "default" | "published" | "archived";

interface ArticleImageRef {
  fileId: string;
  url: string;
}

interface ArticleRow {
  _id?: string;
  fileId: string;
  title: string;
  cover: string;
  excerpt: string;
  status: ArticleStatus;
  tags: string[];
  createAt?: string;
  containImg: ArticleImageRef[];
  content: string;
}

interface UploadFileRecord {
  fileName?: string;
  path?: string;
  url?: string;
}

const router = useRouter();
const route = useRoute();

const isSaving = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);
const coverViewerRef = ref<HTMLDivElement | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

const pos = ref({ x: 0, y: 0 });
const scale = ref(1);
const fitScale = ref(1);
const minScale = ref(0.5);
const maxScale = ref(4);
const dragging = ref(false);

let startX = 0;
let startY = 0;
let originX = 0;
let originY = 0;

const articleData = ref<ArticleRow>({
  fileId: "",
  title: "",
  cover: "",
  excerpt: "",
  status: "default",
  tags: [],
  containImg: [],
  content: "",
});

const statusOptions: { label: string; value: ArticleStatus }[] = [
  { label: "草稿", value: "default" },
  { label: "已发布", value: "published" },
  { label: "已归档", value: "archived" },
];

const routeId = computed(() => String(route.query.id || ""));
const isEditMode = computed(() => routeId.value.length > 0);
const pageTitle = computed(() => (isEditMode.value ? "编辑文章" : "新建文章"));

const baseURL = String(import.meta.env.VITE_BASEURL || "").replace(/\/$/, "");

const normalizePath = (value?: string) => {
  if (!value) return "";
  return value.replace(/^\.\//, "/").replace(/^(\.\.\/)+/, "/");
};

const toAssetUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const normalized = normalizePath(value);
  if (normalized.startsWith("/")) {
    return `${baseURL}${normalized}`;
  }
  return `${baseURL}/${normalized}`;
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

const tagsText = computed({
  get: () => articleData.value.tags.join(", "),
  set: (value: string) => {
    articleData.value.tags = value
      .split(/[,，\n]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  },
});

const coverPreviewUrl = computed(() => toAssetUrl(articleData.value.cover));
const contentWordCount = computed(
  () => articleData.value.content.trim().length,
);
const isGeneratingExcerpt = ref(false);

const imgStyle = computed(() => ({
  transform: `translate3d(${pos.value.x}px, ${pos.value.y}px, 0) scale(${scale.value})`,
  transformOrigin: "0 0",
  cursor: dragging.value ? "grabbing" : "grab",
}));

const currentZoomPercent = computed(() => `${Math.round(scale.value * 100)}%`);

const getViewerMetrics = () => {
  if (!imgRef.value || !coverViewerRef.value) {
    return null;
  }

  const viewerRect = coverViewerRef.value.getBoundingClientRect();
  const naturalWidth = imgRef.value.naturalWidth;
  const naturalHeight = imgRef.value.naturalHeight;

  if (
    !naturalWidth ||
    !naturalHeight ||
    !viewerRect.width ||
    !viewerRect.height
  ) {
    return null;
  }

  return {
    naturalWidth,
    naturalHeight,
    viewerWidth: viewerRect.width,
    viewerHeight: viewerRect.height,
  };
};

const getBounds = (nextScale: number) => {
  const metrics = getViewerMetrics();
  if (!metrics) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  const displayWidth = metrics.naturalWidth * nextScale;
  const displayHeight = metrics.naturalHeight * nextScale;

  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  if (displayWidth <= metrics.viewerWidth) {
    const centered = (metrics.viewerWidth - displayWidth) / 2;
    minX = centered;
    maxX = centered;
  } else {
    minX = metrics.viewerWidth - displayWidth;
    maxX = 0;
  }

  if (displayHeight <= metrics.viewerHeight) {
    const centered = (metrics.viewerHeight - displayHeight) / 2;
    minY = centered;
    maxY = centered;
  } else {
    minY = metrics.viewerHeight - displayHeight;
    maxY = 0;
  }

  return { minX, maxX, minY, maxY };
};

const clampPosition = (nextScale = scale.value) => {
  const bounds = getBounds(nextScale);
  pos.value.x = Math.min(bounds.maxX, Math.max(bounds.minX, pos.value.x));
  pos.value.y = Math.min(bounds.maxY, Math.max(bounds.minY, pos.value.y));
};

const centerImage = (targetScale: number) => {
  const metrics = getViewerMetrics();
  if (!metrics) return;

  const displayWidth = metrics.naturalWidth * targetScale;
  const displayHeight = metrics.naturalHeight * targetScale;

  pos.value.x = (metrics.viewerWidth - displayWidth) / 2;
  pos.value.y = (metrics.viewerHeight - displayHeight) / 2;
};

const applyScale = (
  nextScale: number,
  anchorX: number,
  anchorY: number,
  keepAnchor = true,
) => {
  const prevScale = scale.value;
  if (!prevScale || nextScale === prevScale) return;

  if (keepAnchor) {
    const ratio = nextScale / prevScale;
    pos.value.x = anchorX - (anchorX - pos.value.x) * ratio;
    pos.value.y = anchorY - (anchorY - pos.value.y) * ratio;
  }

  scale.value = nextScale;
  clampPosition(nextScale);
};

const onMouseDown = (e: MouseEvent) => {
  if (!imgRef.value) return;

  dragging.value = true;
  startX = e.clientX;
  startY = e.clientY;
  originX = pos.value.x;
  originY = pos.value.y;

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!dragging.value) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  pos.value.x = originX + dx;
  pos.value.y = originY + dy;

  clampPosition();
};

const onMouseUp = () => {
  dragging.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

const onWheel = (e: WheelEvent) => {
  if (!coverViewerRef.value) return;

  const rect = coverViewerRef.value.getBoundingClientRect();
  const anchorX = e.clientX - rect.left;
  const anchorY = e.clientY - rect.top;

  const factor = Math.exp(-e.deltaY * 0.0015);
  const nextScale = Math.min(
    maxScale.value,
    Math.max(minScale.value, scale.value * factor),
  );

  applyScale(nextScale, anchorX, anchorY, true);
};

const initImageView = async () => {
  if (!imgRef.value) return;

  await nextTick();

  const metrics = getViewerMetrics();
  if (!metrics) return;

  const scaleX = metrics.viewerWidth / metrics.naturalWidth;
  const scaleY = metrics.viewerHeight / metrics.naturalHeight;

  fitScale.value = Math.max(scaleX, scaleY);
  minScale.value = Math.max(0.1, fitScale.value * 0.6);
  maxScale.value = Math.max(4, fitScale.value * 6);

  scale.value = fitScale.value;
  centerImage(scale.value);
  clampPosition();
};

const resetCoverView = () => {
  scale.value = fitScale.value;
  centerImage(scale.value);
  clampPosition();
};

const zoomIn = () => {
  const metrics = getViewerMetrics();
  if (!metrics) return;

  const anchorX = metrics.viewerWidth / 2;
  const anchorY = metrics.viewerHeight / 2;
  const nextScale = Math.min(maxScale.value, scale.value * 1.2);
  applyScale(nextScale, anchorX, anchorY, true);
};

const zoomOut = () => {
  const metrics = getViewerMetrics();
  if (!metrics) return;

  const anchorX = metrics.viewerWidth / 2;
  const anchorY = metrics.viewerHeight / 2;
  const nextScale = Math.max(minScale.value, scale.value / 1.2);
  applyScale(nextScale, anchorX, anchorY, true);
};

const handleResize = () => {
  if (!coverPreviewUrl.value) return;
  clampPosition();
};

const ensureFileId = () => {
  if (!articleData.value.fileId) {
    articleData.value.fileId = `article_${Date.now()}`;
  }
};

const stripMarkdown = (value: string) => {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[>*_~\-#|]/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const generateExcerptByAI = async () => {
  if (isGeneratingExcerpt.value) return;

  const plain = stripMarkdown(articleData.value.content || "");
  if (!plain) {
    window.alert("请先输入正文内容，再生成摘要");
    return;
  }

  isGeneratingExcerpt.value = true;
  try {
    const res = await createExpert(articleData.value.content);
    if (res.code === 200) {
      articleData.value.excerpt = String(res.data || "").slice(0, 500);
    }
  } catch (error) {
    console.error(error);
    window.alert("摘要生成失败，请稍后重试");
  } finally {
    isGeneratingExcerpt.value = false;
  }
};

const uploadSingleImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await http.post("/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return (res.data?.data || {}) as UploadFileRecord;
};

const onSelectCover = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const uploaded = await uploadSingleImage(file);
    const fromFileName = uploaded.fileName
      ? `/uploads/origin/${uploaded.fileName}`
      : "";

    articleData.value.cover =
      fromFileName ||
      normalizePath(uploaded.path) ||
      normalizePath(uploaded.url);

    await nextTick();
    await initImageView();
  } catch (error) {
    console.error(error);
    window.alert("封面上传失败，请稍后重试");
  } finally {
    if (coverInputRef.value) {
      coverInputRef.value.value = "";
    }
  }
};

const saveArticle = async () => {
  if (isSaving.value) return;

  ensureFileId();

  if (!articleData.value.title.trim()) {
    window.alert("请填写文章标题");
    return;
  }

  if (!articleData.value.content.trim()) {
    window.alert("文章内容不能为空");
    return;
  }

  const payload: ArticleRow = {
    ...articleData.value,
    title: articleData.value.title.trim(),
    excerpt: articleData.value.excerpt.trim(),
    tags: articleData.value.tags.map((tag) => tag.trim()).filter(Boolean),
  };

  try {
    isSaving.value = true;

    if (isEditMode.value) {
      await updateArticle(routeId.value, payload);
      window.alert("文章更新成功");
    } else {
      const res = await createArticle(payload);
      window.alert("文章创建成功");

      const newId = res.data?._id || res.data?.id;
      if (newId) {
        router.replace({ path: "/Articles/Edit", query: { id: newId } });
      }
    }
  } catch (error) {
    console.error(error);
    window.alert("保存失败，请稍后重试");
  } finally {
    isSaving.value = false;
  }
};

const initArticle = async () => {
  if (!isEditMode.value) {
    ensureFileId();
    return;
  }

  try {
    const res = await getArticleDetail(routeId.value);
    const raw = (res.data || {}) as Partial<ArticleRow>;

    articleData.value = {
      fileId: raw.fileId || `article_${Date.now()}`,
      title: raw.title || "",
      cover: normalizePath(raw.cover),
      excerpt: raw.excerpt || "",
      status: (raw.status as ArticleStatus) || "default",
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      createAt: raw.createAt,
      containImg: Array.isArray(raw.containImg)
        ? raw.containImg
            .map((item) => ({
              fileId: item.fileId,
              url: normalizePath(item.url),
            }))
            .filter((item) => item.fileId && item.url)
        : [],
      content: raw.content || "",
      _id: raw._id,
    };
  } catch (error) {
    console.error(error);
    window.alert("文章加载失败");
  }
};

watch(
  () => articleData.value.cover,
  async (value) => {
    if (value) {
      await initImageView();
    }
  },
);
// 图片上传
const onUploadImg = async (
  files: File[],
  callback: (urls: string[]) => void,
) => {
  const res = await Promise.all(
    files.map((file: File) => {
      const form = new FormData();
      form.append("image", file);
      return uploadFile(form);
    }),
  );

  // md-editor 需要的是可直接插入 markdown 的图片 URL
  callback(res.map((item: any) => item.data.url));

  // 将上传返回的文件 id 写入 articleData.containImg，避免重复
  const existMap = new Map(
    articleData.value.containImg.map((item) => [item.fileId, item]),
  );

  res.forEach((item: any) => {
    const file = item.data || {};
    const fileId = file._id || file.id || "";
    const url = normalizePath(file.path || file.url || "");
    if (fileId && url) {
      existMap.set(fileId, { fileId, url });
    }
  });

  articleData.value.containImg = Array.from(existMap.values());
};

watch(
  () => route.query.id,
  async () => {
    await initArticle();
  },
);

onMounted(async () => {
  await initArticle();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  onMouseUp();
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="container">
    <div class="topbar">
      <div class="title-group">
        <h2>{{ pageTitle }}</h2>
        <p>
          {{
            isEditMode
              ? `创建时间：${formatDate(articleData.createAt)}`
              : "创建一篇新文章"
          }}
        </p>
      </div>
      <div class="buttons">
        <MaxButton
          icon="icon-park-outline:left"
          color="#3e6fa4"
          height="18"
          @click="router.back()"
        >
          返回
        </MaxButton>
        <MaxButton
          icon="icon-park-outline:save"
          color="#3e6fa4"
          height="18"
          :disabled="isSaving"
          @click="saveArticle"
        >
          {{ isSaving ? "保存中..." : "保存文章" }}
        </MaxButton>
      </div>
    </div>

    <div class="article">
      <section class="main card">
        <div class="editor-meta">
          <span>正文</span>
          <span>{{ contentWordCount }} 字</span>
        </div>
        <MdEditor
          v-model="articleData.content"
          class="editor"
          @onUploadImg="onUploadImg"
        />
      </section>

      <aside class="meta card">
        <div class="field">
          <label for="title">标题</label>
          <MaxInput
            v-model="articleData.title"
            icon="mdi:format-title"
            color="#4b86c4"
            :height="16"
            placeholder="请输入文章标题"
          />
        </div>

        <div class="field">
          <div class="field-head">
            <label for="excerpt">摘要</label>
            <button
              type="button"
              class="ai-btn"
              :disabled="isGeneratingExcerpt"
              @click="generateExcerptByAI"
            >
              {{ isGeneratingExcerpt ? "生成中..." : "AI生成摘要" }}
            </button>
          </div>
          <textarea
            id="excerpt"
            v-model="articleData.excerpt"
            rows="4"
            maxlength="500"
            placeholder="可选，最多 500 字"
          />
          <p class="count-text">{{ articleData.excerpt.length }}/500</p>
        </div>

        <div class="field">
          <label for="status">状态</label>
          <select id="status" v-model="articleData.status">
            <option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="tags">标签</label>
          <MaxInput
            v-model="tagsText"
            icon="mdi:tag-outline"
            color="#4b86c4"
            :height="16"
            placeholder="多个标签用逗号分隔"
          />
        </div>

        <div class="cover">
          <div class="cover-head">
            <span>封面图</span>
            <input
              id="cover-upload"
              ref="coverInputRef"
              type="file"
              accept="image/*"
              @change="onSelectCover"
            />
            <label for="cover-upload">更换封面</label>
          </div>

          <div
            ref="coverViewerRef"
            class="cover-viewer"
            @wheel.prevent="onWheel"
          >
            <img
              v-if="coverPreviewUrl"
              ref="imgRef"
              :src="coverPreviewUrl"
              :style="imgStyle"
              draggable="false"
              @mousedown="onMouseDown"
              @load="initImageView"
            />
            <div v-else class="cover-empty">暂无封面</div>
          </div>

          <div class="cover-controls">
            <button type="button" @click="zoomOut">-</button>
            <span>{{ currentZoomPercent }}</span>
            <button type="button" @click="zoomIn">+</button>
            <button type="button" class="reset" @click="resetCoverView">
              适配
            </button>
          </div>
          <p class="cover-tip">
            拖拽移动，滚轮缩放，缩放范围会随图片尺寸自适应
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  --line: var(--line-color);
  --text: var(--text-color);
  --muted: var(--text-muted);
  --bg: var(--panel-color);

  width: min(1280px, 94vw);
  margin: 8px auto 0;
  height: calc(100vh - 50px);
  padding: 0 4px 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text);

  .card {
    border: 1px solid var(--line);
    border-radius: 14px;
    overflow: hidden;
    background: var(--surface-color);
    background-clip: padding-box;
    box-shadow: 0 8px 22px color-mix(in srgb, var(--shadow-color) 78%, transparent);
  }

  .topbar {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding: 2px 2px 0;

    .title-group {
      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      p {
        margin: 5px 0 0;
        color: var(--muted);
        font-size: 13px;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .article {
    flex: 1;
    overflow: hidden;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 18px;
    align-items: stretch;

    .main {
      min-width: 0;
      padding: 12px;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;

      .editor-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--muted);
        font-size: 13px;
        margin: 2px 2px 10px;
      }

      .editor {
        min-height: 0;
        flex: 1;
      }

      :deep(.md-editor) {
        height: 100%;
        min-height: 0;
      }

      :deep(.md-editor-content) {
        min-height: 0;
      }
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--surface-color) 96%, transparent) 0%,
        color-mix(in srgb, var(--panel-color) 80%, transparent) 100%
      );
      height: 100%;
      overflow: auto;

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .field-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        label {
          font-size: 13px;
          color: var(--text-color);
          font-weight: 600;
        }

        .ai-btn {
          border: 1px solid var(--primary-color);
          background: var(--primary-weak);
          color: var(--primary-color);
          border-radius: 6px;
          font-size: 12px;
          padding: 4px 8px;
          cursor: pointer;

          &:hover {
            filter: brightness(0.95);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 9px 10px;
          border: 1px solid var(--line);
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          box-sizing: border-box;
          background: var(--surface-color);

          &:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-weak);
          }
        }

        textarea {
          resize: vertical;
        }

        :deep(.input-wrap) {
          width: 100%;
          border-color: var(--line);
          background: var(--surface-color);
        }

        .count-text {
          margin: 0;
          color: var(--text-muted);
          font-size: 12px;
          text-align: right;
        }
      }

      .cover {
        border: 1px solid var(--line-color);
        border-radius: 10px;
        padding: 10px;
        background: var(--bg);

        .cover-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          span {
            font-size: 13px;
            color: var(--text-color);
            font-weight: 600;
          }

          #cover-upload {
            display: none;
          }

          label {
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            border-radius: 6px;
            font-size: 12px;
            padding: 4px 8px;
            cursor: pointer;
            background: var(--surface-color);
          }
        }

        .cover-viewer {
          width: 100%;
          height: 360px;
          overflow: hidden;
          position: relative;
          border-radius: 8px;
          border: 1px solid var(--line-color);
          user-select: none;
          background: repeating-linear-gradient(
            -45deg,
            color-mix(in srgb, var(--panel-color) 82%, transparent),
            color-mix(in srgb, var(--panel-color) 82%, transparent) 8px,
            color-mix(in srgb, var(--panel-color) 58%, transparent) 8px,
            color-mix(in srgb, var(--panel-color) 58%, transparent) 16px
          );

          img {
            position: absolute;
            top: 0;
            left: 0;
            max-width: none;
            max-height: none;
            user-select: none;
            will-change: transform;
          }

          .cover-empty {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 13px;
          }
        }

        .cover-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;

          button {
            border: 1px solid var(--line-color);
            background: var(--surface-color);
            color: var(--text-color);
            border-radius: 6px;
            min-width: 28px;
            height: 28px;
            line-height: 28px;
            padding: 0 8px;
            cursor: pointer;

            &:hover {
              border-color: var(--primary-color);
              color: var(--primary-color);
            }
          }

          .reset {
            min-width: 52px;
          }

          span {
            color: var(--text-color);
            font-size: 13px;
            min-width: 56px;
            text-align: center;
          }
        }

        .cover-tip {
          margin: 8px 0 0;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }
      }
    }
  }
}

@media (max-width: 1120px) {
  .container {
    height: auto;
    min-height: 0;
    overflow: visible;

    .article {
      grid-template-columns: 1fr;
      height: auto;
      min-height: 0;

      .meta {
        height: auto;
        overflow: visible;

        .cover {
          .cover-viewer {
            height: 320px;
          }
        }
      }
    }
  }
}
</style>
