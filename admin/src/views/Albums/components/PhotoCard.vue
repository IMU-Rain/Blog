<script lang="ts" setup>
import MaxButton from "@/components/MaxButton.vue";

export interface PhotoCardItem {
  _id: string;
  id?: string;
  album: string;
  fileName: string;
  originalName: string;
  size: number;
  shotTime: string;
  url: string;
  bigThumbUrl?: string;
  smallThumbUrl?: string;
  description?: string;
}

const props = defineProps<{
  item: PhotoCardItem;
  delay?: string;
  aiLoading?: boolean;
  imageUrl: string;
  readableSize: string;
  dateText: string;
}>();

const emit = defineEmits<{
  preview: [item: PhotoCardItem];
  delete: [item: PhotoCardItem];
  createExpert: [item: PhotoCardItem];
  editMeta: [item: PhotoCardItem];
}>();
</script>

<template>
  <article class="photo-card" :style="{ '--delay': delay || '0ms' }">
    <button class="thumb-wrap" type="button" @click="emit('preview', props.item)">
      <img :src="imageUrl" :alt="props.item.originalName" />
    </button>
    <div class="meta">
      <h3>{{ props.item.originalName || props.item.fileName }}</h3>
      <p>相册：{{ props.item.album || "default" }}</p>
      <p>大小：{{ readableSize }}</p>
      <p>时间：{{ dateText }}</p>
      <p class="description" :title="props.item.description || '暂无描述'">
        描述：{{ props.item.description || "暂无描述" }}
      </p>
    </div>
    <div class="card-actions">
      <MaxButton
        icon="mdi:robot-outline"
        height="14"
        color="#5179d6"
        :disabled="aiLoading"
        @click="emit('createExpert', props.item)"
      >
        {{ aiLoading ? "生成中..." : "生成描述" }}
      </MaxButton>
      <MaxButton
        icon="mdi:eye-outline"
        height="14"
        color="#3d70a8"
        @click="emit('preview', props.item)"
      >
        预览
      </MaxButton>
      <MaxButton
        icon="solar:settings-outline"
        height="14"
        color="#548f7a"
        @click="emit('editMeta', props.item)"
      >
        编辑Meta
      </MaxButton>
      <MaxButton
        icon="solar:trash-bin-minimalistic-outline"
        height="14"
        color="#cf4d63"
        @click="emit('delete', props.item)"
      >
        删除
      </MaxButton>
    </div>
  </article>
</template>

<style scoped lang="less">
.photo-card {
  border-radius: 16px;
  border: 1px solid var(--line-color);
  background: var(--surface-color);
  overflow: hidden;
  box-shadow: 0 8px 18px var(--shadow-color);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 26px rgba(11, 31, 56, 0.2);
    border-color: color-mix(in srgb, var(--primary-color) 35%, var(--line-color));
  }
}

.thumb-wrap {
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--panel-color);
  cursor: zoom-in;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1);
    transition:
      transform 0.42s ease,
      filter 0.42s ease;
  }

  &:hover img {
    transform: scale(1.08);
    filter: saturate(1.06) contrast(1.04);
  }
}

.meta {
  padding: 12px;
  line-height: 1.5;
  display: grid;
  gap: 4px;

  h3 {
    margin: 0;
    font-size: 14px;
    color: var(--text-color);
    word-break: break-all;
  }

  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
  }

  .description {
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 38px;
  }
}

.card-actions {
  padding: 0 12px 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  :deep(.button-container) {
    width: 100%;
    justify-content: center;
    border-width: 1px;
    padding: 8px 10px;
    border-radius: 12px;
    min-height: 34px;
  }
}
</style>
