<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import MaxButton from "@/components/MaxButton.vue";
import MaxMessage from "@/components/MaxMessage";
import PhotoCard, { type PhotoCardItem } from "./components/PhotoCard.vue";
import { uploadFile } from "@/api/File";
import {
  addPhotosToAlbum,
  createPhotoExpert,
  deletePhotos,
  getPhotos,
  updatePhotoMeta,
} from "@/api/albums";

type PhotoItem = PhotoCardItem;

const router = useRouter();
const uploadRef = ref<HTMLInputElement | null>(null);
const albumName = ref("default");
const albumFilter = ref("all");
const photos = ref<PhotoItem[]>([]);
const isLoading = ref(false);
const isUploading = ref(false);
const isPreviewOpen = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");
const aiLoadingMap = ref<Record<string, boolean>>({});
// 解析服务器地址
const resolveServerOrigin = () => {
  try {
    const base = new URL(import.meta.env.VITE_BASEURL);
    return base.origin;
  } catch {
    return window.location.origin;
  }
};

const normalizePhotoUrl = (rawUrl?: string) => {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }
  const normalizedPath = rawUrl
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "/")
    .replace(/^\.?\//, "/");
  const origin = resolveServerOrigin();
  return `${origin}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
};
// 数据初始化
const toReadableSize = (size = 0) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

const toDateText = (time?: string) => {
  if (!time) return "-";
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const uniqueAlbums = computed(() => {
  const albums = new Set<string>();
  photos.value.forEach((item) => {
    albums.add(item.album || "default");
  });
  return ["all", ...Array.from(albums)];
});

const filteredPhotos = computed(() => {
  if (albumFilter.value === "all") {
    return photos.value;
  }
  return photos.value.filter((item) => item.album === albumFilter.value);
});

const refreshPhotos = async () => {
  isLoading.value = true;
  try {
    const res = await getPhotos();
    if (res.code === 200 && Array.isArray(res.data)) {
      photos.value = res.data as PhotoItem[];
    }
  } finally {
    isLoading.value = false;
  }
};

const triggerUpload = () => {
  uploadRef.value?.click();
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;
  if (!fileList || fileList.length === 0) {
    return;
  }

  const files = Array.from(fileList);
  const ids: string[] = [];
  isUploading.value = true;
  try {
    for (const file of files) {
      const data = new FormData();
      data.append("image", file);
      const uploadRes = await uploadFile(data);
      if (uploadRes.code === 200 && uploadRes.data) {
        const id = uploadRes.data._id || uploadRes.data.id;
        if (id) {
          ids.push(String(id));
        }
      }
    }
    if (ids.length > 0) {
      await addPhotosToAlbum({
        id: ids,
        album: albumName.value.trim() || "default",
      });
      await refreshPhotos();
    }
  } finally {
    isUploading.value = false;
    input.value = "";
  }
};

const openPreview = (item: PhotoItem) => {
  previewUrl.value = normalizePhotoUrl(item.bigThumbUrl || item.url);
  previewTitle.value = item.originalName || item.fileName;
  isPreviewOpen.value = true;
};

const closePreview = () => {
  isPreviewOpen.value = false;
  previewUrl.value = "";
  previewTitle.value = "";
};

const removePhoto = async (item: PhotoItem) => {
  const id = item._id || item.id;
  if (!id) {
    return;
  }
  const ok = window.confirm("确定删除这张图片吗？此操作不可恢复。");
  if (!ok) {
    return;
  }
  await deletePhotos([id]);
  await refreshPhotos();
};

const getPhotoId = (item: PhotoItem) => String(item._id || item.id || "");

const getExpertText = (value: any) => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value && typeof value === "object") {
    return String(value.description || value.expert || value.content || "").trim();
  }
  return "";
};

const handleCreateExpert = async (item: PhotoItem) => {
  const id = getPhotoId(item);
  if (!id || aiLoadingMap.value[id]) {
    return;
  }

  aiLoadingMap.value[id] = true;
  try {
    const res = await createPhotoExpert(id);
    const expert = getExpertText(res.data);
    if (!expert) {
      MaxMessage({
        message: "未获取到描述内容",
        icon: "solar:danger-triangle-outline",
        color: "#cf4d63",
      });
      return;
    }
    await updatePhotoMeta(id, { description: expert });
    item.description = expert;
    MaxMessage({
      message: "描述生成并保存成功",
      icon: "mdi:check-circle-outline",
      color: "#2f7ccf",
    });
  } catch (error) {
    console.error(error);
    MaxMessage({
      message: "描述生成或保存失败，请稍后重试",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
  } finally {
    aiLoadingMap.value[id] = false;
  }
};

const handleEditMeta = (item: PhotoItem) => {
  const id = getPhotoId(item);
  if (!id) {
    return;
  }
  router.push({ path: "/Albums/EditMeta", query: { id } });
};

onMounted(() => {
  refreshPhotos();
});
</script>

<template>
  <div class="albums-page page-container">
    <div class="toolbar">
      <div class="title">图片管理</div>
      <div class="actions">
        <MaxButton
          icon="icon-park-outline:left"
          height="16"
          color="#4f86d8"
          @click="router.push('/Dashboard')"
        >
          返回首页
        </MaxButton>
      </div>
    </div>

    <section class="upload-panel">
      <div class="field-group">
        <label for="albumName">上传到相册</label>
        <input id="albumName" v-model="albumName" type="text" />
      </div>
      <div class="field-group">
        <label for="albumFilter">筛选相册</label>
        <select id="albumFilter" v-model="albumFilter">
          <option v-for="name in uniqueAlbums" :key="name" :value="name">
            {{ name === "all" ? "全部" : name }}
          </option>
        </select>
      </div>
      <div class="upload-action">
        <input
          ref="uploadRef"
          class="hidden-input"
          type="file"
          accept="image/*"
          multiple
          @change="handleFileChange"
        />
        <MaxButton
          icon="formkit:add"
          height="16"
          color="#2f7ccf"
          :disabled="isUploading"
          @click="triggerUpload"
        >
          {{ isUploading ? "上传中..." : "上传图片" }}
        </MaxButton>
      </div>
    </section>

    <section v-if="isLoading" class="status">加载中...</section>
    <section v-else-if="filteredPhotos.length === 0" class="status">
      暂无图片
    </section>
    <TransitionGroup v-else tag="section" class="photo-grid" name="photo-list">
      <PhotoCard
        v-for="(item, index) in filteredPhotos"
        :key="item._id"
        :item="item"
        :delay="`${Math.min(index, 11) * 45}ms`"
        :ai-loading="aiLoadingMap[getPhotoId(item)]"
        :image-url="normalizePhotoUrl(item.smallThumbUrl || item.bigThumbUrl || item.url)"
        :readable-size="toReadableSize(item.size)"
        :date-text="toDateText(item.shotTime)"
        @preview="openPreview"
        @delete="removePhoto"
        @create-expert="handleCreateExpert"
        @edit-meta="handleEditMeta"
      />
    </TransitionGroup>

    <teleport to="body">
      <transition name="preview-fade">
        <div v-if="isPreviewOpen" class="preview-mask" @click.self="closePreview">
          <div class="preview-dialog">
            <div class="preview-head">
              <h3>{{ previewTitle }}</h3>
              <button type="button" class="close" @click="closePreview">
                关闭
              </button>
            </div>
            <div class="preview-body">
              <img :src="previewUrl" :alt="previewTitle" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped lang="less">
.albums-page {
  width: min(1260px, 94vw);
  margin: 0 auto;
  padding-bottom: 40px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 4px 14px;
  border-bottom: 1px solid var(--line-color);
  margin-bottom: 12px;

  .title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: 0.3px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .actions :deep(.button-container) {
    border-width: 1px;
    border-radius: 999px;
    min-height: 34px;
    padding: 8px 14px;
    box-shadow: 0 6px 14px var(--shadow-color);
  }
}

.upload-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 16px;
  align-items: end;
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 8px 16px var(--shadow-color);
  margin-bottom: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-muted);
  }

  input,
  select {
    border-radius: 12px;
    border: 1px solid var(--line-color);
    outline: none;
    padding: 10px 12px;
    background: var(--bg-color);
    color: var(--text-color);
  }
}

.upload-action {
  display: flex;
  justify-content: flex-end;
}

.hidden-input {
  display: none;
}

.status {
  margin-top: 18px;
  text-align: center;
  color: var(--text-muted);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(4, 12, 26, 0.68);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  padding: 20px;
}

.preview-dialog {
  width: min(960px, 96vw);
  max-height: 90vh;
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform-origin: center center;
}

.preview-head {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line-color);

  h3 {
    margin: 0;
    font-size: 14px;
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .close {
    border: 1px solid var(--line-color);
    border-radius: 10px;
    padding: 6px 10px;
    background: transparent;
    cursor: pointer;
  }
}

.preview-body {
  padding: 14px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    display: block;
    max-width: 100%;
    max-height: calc(90vh - 94px);
    object-fit: contain;
    border-radius: 8px;
  }
}

.photo-list-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  transition-delay: var(--delay);
}

.photo-list-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.photo-list-move {
  transition: transform 0.3s ease;
}

.photo-list-enter-from,
.photo-list-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: background-color 0.24s ease;
}

.preview-fade-enter-active .preview-dialog,
.preview-fade-leave-active .preview-dialog {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.preview-fade-enter-from {
  background: rgba(4, 12, 26, 0);
}

.preview-fade-enter-from .preview-dialog,
.preview-fade-leave-to .preview-dialog {
  opacity: 0;
  transform: scale(0.94) translateY(8px);
}

@media (max-width: 900px) {
  .upload-panel {
    grid-template-columns: 1fr;
  }

  .upload-action {
    justify-content: flex-start;
  }
}
</style>
