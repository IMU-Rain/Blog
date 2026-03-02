<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";

interface ToastProps {
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
}

const props = withDefaults(defineProps<ToastProps>(), {
  icon: "mdi:check-circle-outline",
  color: "#2f7ccf",
  duration: 2200,
});

const emit = defineEmits<{
  destroy: [];
}>();

const visible = ref(false);

const close = () => {
  visible.value = false;
  window.setTimeout(() => {
    emit("destroy");
  }, 230);
};

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true;
  });
  window.setTimeout(close, Math.max(800, props.duration));
});
</script>

<template>
  <Transition name="max-message-fade">
    <div v-if="visible" class="max-message" role="status" aria-live="polite">
      <span class="icon-wrap" :style="{ color }">
        <Icon :icon="icon" width="24" />
      </span>
      <span class="text">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped lang="less">
.max-message {
  width: fit-content;
  max-width: calc(100vw - 20px);
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 14px 18px;
  min-height: 60px;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--line-color) 88%, transparent);
  color: var(--text-color);
  background: color-mix(in srgb, var(--surface-color) 94%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 36px rgba(12, 24, 41, 0.22);
  will-change: transform, opacity;
  animation: message-drop-in 0.68s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.icon-wrap {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 15%, transparent);
  animation: icon-shift 0.68s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.text {
  max-width: 0px;
  margin-left: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0;
  transform: translateX(-8px);
  animation: text-reveal 0.85s linear 0.3s forwards;
  line-height: 1.45;
  word-break: break-word;
  font-size: 16px;
  font-weight: 500;
}

@keyframes message-drop-in {
  0% {
    opacity: 0;
    transform: translateY(-60px);
  }
  55% {
    opacity: 1;
    transform: translateY(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes icon-shift {
  0% {
    transform: translateX(0);
  }
  46% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-3px);
  }
}

@keyframes text-reveal {
  0% {
    max-width: 0px;
    margin-left: 0;
    opacity: 0;
    transform: translateX(-8px);
  }
  100% {
    max-width: min(560px, calc(100vw - 110px));
    margin-left: 12px;
    opacity: 1;
    transform: translateX(0);
  }
}

.max-message-fade-enter-active,
.max-message-fade-leave-active {
  will-change: transform, opacity, filter;
}

.max-message-fade-enter-from,
.max-message-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.max-message-fade-leave-active {
  animation: message-exit 0.34s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.max-message-fade-leave-active .text {
  animation: text-hide 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.max-message-fade-leave-active .icon-wrap {
  animation: icon-return 0.24s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes message-exit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-18px) scale(0.97);
    filter: blur(1.5px);
  }
}

@keyframes text-hide {
  0% {
    max-width: min(560px, calc(100vw - 110px));
    margin-left: 12px;
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    max-width: 0px;
    margin-left: 0;
    opacity: 0;
    transform: translateX(-6px);
  }
}

@keyframes icon-return {
  0% {
    transform: translateX(-3px);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 0.75;
  }
}

@media (max-width: 720px) {
  .max-message {
    max-width: calc(100vw - 16px);
    padding: 12px 14px;
    border-radius: 9999px;
    min-height: 54px;
  }

  .text {
    font-size: 14px;
  }
}
</style>
