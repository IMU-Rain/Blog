<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="userStore.isLoginModalOpen"
        class="login-overlay"
        @click.self="close"
      >
        <section
          class="login-dialog"
          :class="{ shake: shouldShake }"
          role="dialog"
          aria-modal="true"
        >
          <button class="close-btn" type="button" aria-label="关闭" @click="close">
            ×
          </button>
          <transition name="success-pop" mode="out-in">
            <div v-if="success" class="success-panel">
              <div class="success-mark">✓</div>
              <h2>{{ mode === "login" ? "登录成功" : "注册成功" }}</h2>
              <p>欢迎，{{ successName }}</p>
            </div>
            <div v-else key="form-panel">
              <div class="login-header">
                <h2>{{ mode === "login" ? "登录" : "注册" }}</h2>
                <p>{{ mode === "login" ? "登录后即可发表评论" : "创建账号后即可发表评论" }}</p>
              </div>

              <div class="mode-tabs">
                <button
                  type="button"
                  :class="{ active: mode === 'login' }"
                  @click="switchMode('login')"
                >
                  登录
                </button>
                <button
                  type="button"
                  :class="{ active: mode === 'register' }"
                  @click="switchMode('register')"
                >
                  注册
                </button>
              </div>

              <form :key="mode" class="login-form" @submit.prevent="submit">
                <label>
                  <span>用户名</span>
                  <input
                    v-model.trim="form.username"
                    autocomplete="username"
                    placeholder="3-30位字母、数字或下划线"
                  />
                </label>
                <label v-if="mode === 'register'">
                  <span>昵称</span>
                  <input
                    v-model.trim="form.nickname"
                    autocomplete="nickname"
                    placeholder="展示在评论区"
                  />
                </label>
                <label>
                  <span>密码</span>
                  <input
                    v-model="form.password"
                    autocomplete="current-password"
                    type="password"
                    placeholder="至少6位"
                  />
                </label>
                <label>
                  <span>验证码</span>
                  <div class="captcha-row">
                    <input
                      v-model.trim="form.captcha"
                      autocomplete="off"
                      inputmode="text"
                      placeholder="输入右侧字符"
                    />
                    <button
                      class="captcha-card"
                      type="button"
                      aria-label="刷新验证码"
                      title="点击刷新验证码"
                      @click="refreshCaptcha"
                    >
                      <span
                        v-for="(char, index) in captchaChars"
                        :key="`${char}-${index}`"
                        :style="getCaptchaCharStyle(index)"
                      >
                        {{ char }}
                      </span>
                    </button>
                  </div>
                </label>

                <p v-if="message" class="message">
                  {{ message }}
                </p>

                <button
                  class="submit-btn"
                  type="submit"
                  :disabled="submitting || cooldownLeft > 0"
                >
                  {{ submitText }}
                </button>
              </form>
            </div>
          </transition>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import axios from "axios";
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { login, register } from "../api/account";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const mode = ref<"login" | "register">("login");
const submitting = ref(false);
const message = ref("");
const success = ref(false);
const successName = ref("");
const shouldShake = ref(false);
const captchaCode = ref("");
const cooldownLeft = ref(0);
const failedCount = ref(0);
let cooldownTimer: number | null = null;
const form = reactive({
  username: "",
  nickname: "",
  password: "",
  captcha: "",
});

const captchaChars = computed(() => captchaCode.value.split(""));

const submitText = computed(() => {
  if (cooldownLeft.value > 0) return `${cooldownLeft.value}s 后再试`;
  if (submitting.value) return "处理中";
  return mode.value === "login" ? "登录" : "注册并登录";
});

const createCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => {
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
};

const refreshCaptcha = () => {
  captchaCode.value = createCaptcha();
  form.captcha = "";
};

const getCaptchaCharStyle = (index: number) => {
  const rotations = [-10, 7, -4, 9, -7];
  const offsets = [1, -2, 2, -1, 1];
  return {
    transform: `translateY(${offsets[index] || 0}px) rotate(${
      rotations[index] || 0
    }deg)`,
  };
};

const triggerShake = () => {
  shouldShake.value = false;
  window.requestAnimationFrame(() => {
    shouldShake.value = true;
    window.setTimeout(() => {
      shouldShake.value = false;
    }, 420);
  });
};

const startCooldown = (seconds: number) => {
  if (cooldownTimer !== null) {
    window.clearInterval(cooldownTimer);
  }
  cooldownLeft.value = seconds;
  cooldownTimer = window.setInterval(() => {
    cooldownLeft.value -= 1;
    if (cooldownLeft.value <= 0 && cooldownTimer !== null) {
      window.clearInterval(cooldownTimer);
      cooldownTimer = null;
      cooldownLeft.value = 0;
    }
  }, 1000);
};

const noteFailure = () => {
  failedCount.value += 1;
  triggerShake();
  refreshCaptcha();
  if (failedCount.value >= 3) {
    startCooldown(8);
  }
};

const resetMessage = () => {
  message.value = "";
};

const resetFormState = (keepUsername = true) => {
  if (!keepUsername) {
    form.username = "";
    form.nickname = "";
  }
  form.password = "";
  form.captcha = "";
  refreshCaptcha();
};

const switchMode = (nextMode: "login" | "register") => {
  mode.value = nextMode;
  resetMessage();
  refreshCaptcha();
};

const close = () => {
  userStore.closeLoginModal();
};

const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.detail || err.response?.data?.message || "操作失败";
  }
  return "操作失败";
};

const submit = async () => {
  resetMessage();
  if (cooldownLeft.value > 0) {
    message.value = `操作太快了，请 ${cooldownLeft.value}s 后再试`;
    triggerShake();
    return;
  }
  if (!form.username || !form.password) {
    message.value = "请填写用户名和密码";
    triggerShake();
    return;
  }
  if (mode.value === "register" && form.password.length < 6) {
    message.value = "密码长度不能少于6位";
    triggerShake();
    return;
  }
  if (form.captcha.toUpperCase() !== captchaCode.value) {
    message.value = "验证码不正确，请重新输入";
    noteFailure();
    return;
  }

  submitting.value = true;
  try {
    const res =
      mode.value === "login"
        ? await login({
            username: form.username,
            password: form.password,
          })
        : await register({
            username: form.username,
            nickname: form.nickname || form.username,
            password: form.password,
          });
    userStore.setUser(res.user);
    success.value = true;
    successName.value = res.user.nickname || res.user.username;
    message.value = "";
    failedCount.value = 0;
    window.setTimeout(() => {
      resetFormState();
      close();
    }, 450);
  } catch (err) {
    message.value = getErrorMessage(err);
    noteFailure();
  } finally {
    submitting.value = false;
  }
};

watch(
  () => userStore.isLoginModalOpen,
  (visible) => {
    if (visible) {
      mode.value = "login";
      resetMessage();
      success.value = false;
      successName.value = "";
      form.password = "";
      refreshCaptcha();
    } else {
      window.setTimeout(() => {
        success.value = false;
        successName.value = "";
        resetMessage();
        resetFormState();
      }, 260);
    }
  },
);

onBeforeUnmount(() => {
  if (cooldownTimer !== null) {
    window.clearInterval(cooldownTimer);
  }
});
</script>

<style scoped lang="less">
@import "../style/theme.less";

.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 60000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: color-mix(in srgb, var(--bg-color) 22%, rgba(4, 10, 20, 0.76));
  backdrop-filter: blur(8px);
}

.login-dialog {
  position: relative;
  width: min(420px, 100%);
  padding: 24px;
  border: 1px solid var(--line-color);
  border-radius: 18px;
  background: var(--surface-color);
  box-shadow: 0 24px 50px color-mix(in srgb, var(--shadow-color) 92%, transparent);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--primary-weak) 72%, transparent),
        transparent 42%
      ),
      radial-gradient(
        360px 160px at 100% 0,
        color-mix(in srgb, var(--primary-color) 14%, transparent),
        transparent 68%
      );
  }

  &.shake {
    animation: dialog-shake 0.36s ease;
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: var(--text-muted);
  background: color-mix(in srgb, var(--panel-color) 72%, transparent);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: var(--text-color);
    transform: rotate(8deg) scale(1.04);
  }
}

.login-header {
  position: relative;
  padding-right: 32px;
  margin-bottom: 18px;

  h2 {
    margin: 0 0 6px;
    color: var(--text-color);
    font-size: 24px;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: var(--text-muted);
    font-size: 14px;
  }
}

.mode-tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--panel-color) 70%, transparent);

  button {
    height: 36px;
    border-radius: 10px;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &.active {
      color: var(--text-color);
      background: var(--surface-color);
      box-shadow: 0 4px 12px var(--shadow-color);
    }
  }
}

.login-form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: form-slide 0.22s ease;

  label {
    display: flex;
    flex-direction: column;
    gap: 7px;

    span {
      color: var(--text-color);
      font-size: 14px;
      font-weight: 700;
    }
  }

  input {
    width: 100%;
    height: 42px;
    border: 1px solid var(--line-color);
    border-radius: 12px;
    padding: 0 12px;
    outline: none;
    background: color-mix(in srgb, var(--panel-color) 34%, var(--surface-color));
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
  }
}

.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px;
  gap: 10px;
}

.captcha-card {
  position: relative;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid color-mix(in srgb, var(--primary-color) 28%, var(--line-color));
  border-radius: 12px;
  color: var(--text-color);
  cursor: pointer;
  overflow: hidden;
  background:
    repeating-linear-gradient(
      45deg,
      color-mix(in srgb, var(--panel-color) 65%, transparent) 0 6px,
      color-mix(in srgb, var(--surface-color) 84%, transparent) 6px 12px
    );

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 8px;
    right: 8px;
    height: 1px;
    background: color-mix(in srgb, var(--primary-color) 34%, transparent);
    transform: rotate(-8deg);
  }

  &::before {
    top: 13px;
  }

  &::after {
    bottom: 12px;
    transform: rotate(7deg);
  }

  span {
    position: relative;
    z-index: 1;
    display: inline-block;
    min-width: 17px;
    font-weight: 900;
    font-size: 18px;
    letter-spacing: 0;
    user-select: none;
  }
}

.message {
  margin: -2px 0 0;
  color: #c64545;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.success-panel {
  position: relative;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-color);

  .success-mark {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border-radius: 50%;
    color: var(--surface-color);
    background: #2e8b57;
    font-size: 34px;
    font-weight: 900;
    box-shadow: 0 12px 24px color-mix(in srgb, #2e8b57 36%, transparent);
    animation: success-mark 0.36s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: var(--text-muted);
  }
}

.submit-btn {
  height: 42px;
  border-radius: 12px;
  color: var(--surface-color);
  background: var(--primary-color);
  cursor: pointer;
  font-weight: 700;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px var(--shadow-color);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;

  .login-dialog {
    transition:
      opacity 0.24s ease,
      transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .login-dialog {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
  }
}

.success-pop-enter-active,
.success-pop-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.success-pop-enter-from,
.success-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@keyframes form-slide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dialog-shake {
  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-8px);
  }

  40% {
    transform: translateX(7px);
  }

  60% {
    transform: translateX(-5px);
  }

  80% {
    transform: translateX(3px);
  }
}

@keyframes success-mark {
  from {
    opacity: 0;
    transform: scale(0.65) rotate(-12deg);
  }

  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

@media (max-width: 520px) {
  .login-overlay {
    align-items: flex-end;
    padding: 14px;
  }

  .login-dialog {
    padding: 22px 18px;
    border-radius: 18px;
  }

  .captcha-row {
    grid-template-columns: 1fr;
  }
}
</style>
