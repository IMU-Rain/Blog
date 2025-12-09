<template>
  <transition name="fade">
    <div v-if="visible" class="message" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup name="Message">
import { ref, onMounted } from "vue";

const props = defineProps({
  message: String,
  type: { type: String, default: "info" },
  duration: { type: Number, default: 2000 },
});

const visible = ref(false);

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
});
</script>

<style scoped>
.message {
  padding: 12px 16px;
  text-align: center;
  border-radius: 999px;
  margin-top: 12px;
  color: #fff;
  width: fit-content;
  position: absolute;
  font-size: 1.3rem;
  letter-spacing: 2px;
  top: 10%;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 类型 */
.info {
  background: #409eff;
}

.success {
  background: #67c23a;
}

.error {
  background: #f56c6c;
}

/* 动画 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -15px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
</style>
