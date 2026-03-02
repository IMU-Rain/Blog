<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MaxButton from "@/components/MaxButton.vue";
import MaxMessage from "@/components/MaxMessage";
import { getPhotoDetail, updatePhotoMeta } from "@/api/albums";

interface PhotoMetaForm {
  id: string;
  name: string;
  album: string;
  description: string;
  tagsText: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isSaving = ref(false);

const form = ref<PhotoMetaForm>({
  id: "",
  name: "",
  album: "",
  description: "",
  tagsText: "",
});

const routeId = computed(() => String(route.query.id || ""));

const loadDetail = async () => {
  if (!routeId.value) {
    MaxMessage({
      message: "缺少图片ID",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
    router.back();
    return;
  }

  isLoading.value = true;
  try {
    const res = await getPhotoDetail(routeId.value);
    if (res.code === 200 && res.data) {
      const data = res.data;
      form.value = {
        id: String(data._id || routeId.value),
        name: data.originalName || "",
        album: data.album || "default",
        description: data.description || "",
        tagsText: Array.isArray(data.tags) ? data.tags.join(", ") : "",
      };
    }
  } catch (error) {
    console.error(error);
    MaxMessage({
      message: "图片详情加载失败",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
  } finally {
    isLoading.value = false;
  }
};

const saveMeta = async () => {
  if (!form.value.id || isSaving.value) return;
  if (!form.value.name.trim()) {
    MaxMessage({
      message: "图片名称不能为空",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
    return;
  }
  if (!form.value.album.trim()) {
    MaxMessage({
      message: "相册名称不能为空",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
    return;
  }

  isSaving.value = true;
  try {
    const tags = form.value.tagsText
      .split(/[,，\n]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    await updatePhotoMeta(form.value.id, {
      name: form.value.name.trim(),
      album: form.value.album.trim(),
      description: form.value.description.trim(),
      tags,
    });
    MaxMessage({
      message: "图片信息更新成功",
      icon: "mdi:check-circle-outline",
      color: "#2f7ccf",
    });
    router.push("/Albums");
  } catch (error) {
    console.error(error);
    MaxMessage({
      message: "图片信息更新失败",
      icon: "solar:danger-triangle-outline",
      color: "#cf4d63",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <div class="page-wrap">
    <div class="page-head">
      <h2>编辑图片 Meta</h2>
      <div class="actions">
        <MaxButton
          icon="icon-park-outline:left"
          height="16"
          color="#4f86d8"
          @click="router.back()"
        >
          返回
        </MaxButton>
        <MaxButton
          icon="icon-park-outline:save"
          height="16"
          color="#2f7ccf"
          :disabled="isSaving || isLoading"
          @click="saveMeta"
        >
          {{ isSaving ? "保存中..." : "保存Meta" }}
        </MaxButton>
      </div>
    </div>

    <section class="form-card" v-if="!isLoading">
      <div class="field">
        <label>图片ID</label>
        <input :value="form.id" disabled />
      </div>
      <div class="field">
        <label>图片名称</label>
        <input v-model="form.name" placeholder="请输入图片名称" />
      </div>
      <div class="field">
        <label>所属相册</label>
        <input v-model="form.album" placeholder="请输入相册名称" />
      </div>
      <div class="field">
        <label>标签</label>
        <input v-model="form.tagsText" placeholder="多个标签用逗号分隔" />
      </div>
      <div class="field">
        <label>描述</label>
        <textarea
          v-model="form.description"
          rows="8"
          maxlength="500"
          placeholder="请输入图片描述"
        />
      </div>
    </section>
    <section class="loading-card" v-else>加载中...</section>
  </div>
</template>

<style scoped lang="less">
.page-wrap {
  width: min(980px, 94vw);
  margin: 0 auto;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 2px 14px;
  border-bottom: 1px solid var(--line-color);
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.form-card,
.loading-card {
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
}

.loading-card {
  padding: 18px;
  text-align: center;
  color: var(--text-muted);
}

.form-card {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;

  label {
    font-size: 13px;
    color: var(--text-muted);
  }

  input,
  textarea {
    border-radius: 10px;
    border: 1px solid var(--line-color);
    padding: 10px 12px;
    background: var(--bg-color);
    color: var(--text-color);
    outline: none;
  }

  input:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  textarea {
    resize: vertical;
  }
}
</style>
