<template>
  <section v-if="content" class="article-expert" aria-label="AI摘要">
    <div class="expert-head">
      <span class="pulse"></span>
      <span class="label">AI 摘要</span>
    </div>
    <p class="expert-content">
      {{ visibleContent }}<span v-if="isStreaming" class="cursor"></span>
    </p>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  content?: string;
}>();

const content = computed(() => String(props.content || "").trim());
const visibleContent = ref("");
const isStreaming = ref(false);
let timer: number | null = null;

const clearStreamingTimer = () => {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
};

const startStreaming = () => {
  clearStreamingTimer();
  visibleContent.value = "";

  if (!content.value) {
    isStreaming.value = false;
    return;
  }

  isStreaming.value = true;
  let index = 0;
  timer = window.setInterval(() => {
    const step = content.value.charCodeAt(index) > 255 ? 1 : 2;
    index = Math.min(content.value.length, index + step);
    visibleContent.value = content.value.slice(0, index);

    if (index >= content.value.length) {
      clearStreamingTimer();
      isStreaming.value = false;
    }
  }, 28);
};

watch(content, startStreaming, { immediate: true });

onBeforeUnmount(clearStreamingTimer);
</script>

<style scoped lang="less">
.article-expert {
  margin: 18px 24px 0;
  padding: 16px 18px;
  border: 1px solid
    color-mix(in srgb, var(--primary-color) 26%, var(--line-color));
  border-radius: 14px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--primary-weak) 58%, transparent) 0%,
      color-mix(in srgb, var(--panel-color) 74%, transparent) 100%
    ),
    var(--surface-color);
  box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 48%, transparent);
}

.expert-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.pulse {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--primary-color);
  box-shadow: 0 0 0 0 var(--primary-weak);
  animation: pulse 1.35s ease-out infinite;
}

.label {
  font-size: 14px;
  font-weight: 800;
}

.status {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--primary-color);
  background: var(--surface-color);
  border: 1px solid
    color-mix(in srgb, var(--primary-color) 20%, var(--line-color));
  font-size: 12px;
  font-weight: 700;
}

.expert-content {
  min-height: 54px;
  margin: 0;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.85;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.14em;
  border-radius: 999px;
  background: var(--primary-color);
  animation: blink 0.85s steps(2, start) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes pulse {
  70% {
    box-shadow: 0 0 0 8px
      color-mix(in srgb, var(--primary-weak) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-weak) 0%, transparent);
  }
}

@media (max-width: 960px) {
  .article-expert {
    margin: 14px 16px 0;
    padding: 14px;
  }

  .expert-content {
    min-height: 48px;
    font-size: 15px;
  }
}
</style>
