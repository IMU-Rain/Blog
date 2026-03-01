<script lang="ts" setup>
import MaxInput from "@/components/MaxInput.vue";
import MaxButton from "@/components/MaxButton.vue";
import { ref } from "vue";
import { login } from "@/api/account";
import { useRouter } from "vue-router";
const router = useRouter();
const loginData = ref({ username: "", password: "" });
const handleLogin = () => {
  login(loginData.value).then((res) => {
    if (res.code === 200) {
      router.push("/Dashboard");
    }
  });
};
</script>

<template>
  <div class="login-card-container card-shadow">
    <div class="login-card">
      <img src="@/assets/login.jpg" class="login-img" />
      <div class="login-form">
        <div class="title">
          <h2>Welcome back! Max</h2>
        </div>
        <form>
          <MaxInput
            v-model="loginData.username"
            placeholder="User Name"
            icon="mdi:account-outline"
            color="#4f7fb7"
            :height="18"
          ></MaxInput>
          <MaxInput
            v-model="loginData.password"
            placeholder="Password"
            type="password"
            icon="mdi:lock-outline"
            color="#4f7fb7"
            :height="18"
          ></MaxInput>
          <MaxButton size="large" color="relex" @click="handleLogin"
            >Sign in</MaxButton
          >
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "@/style/mixin.less";
.login-card-container {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .login-card {
    overflow: hidden;
    width: min(1080px, 92vw);
    height: min(680px, 84vh);
    border: 1px solid var(--line-color);
    border-radius: @card-roudend;
    box-shadow: 0 14px 34px var(--shadow-color);
    background-color: var(--surface-color);
    display: flex;
    .login-img {
      height: 100%;
      width: 58%;
      object-fit: cover;
      border-radius: @card-roudend;
    }
    .login-form {
      width: 42%;
      padding: 5% 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h2 {
        color: var(--text-color);
        margin-bottom: 50px;
        overflow: hidden;
        position: relative;
        &::after {
          content: "";
          width: 100%;
          height: 100%;
          background-color: var(--surface-color);
          top: 0;
          left: 180%;
          transform: skew(-45deg);
          position: absolute;
          animation: toright 3s linear;
        }
      }
      form {
        display: flex;
        width: min(360px, 100%);
        gap: 30px;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}

@media (max-width: 920px) {
  .login-card-container {
    .login-card {
      width: min(760px, 92vw);
      min-height: 540px;
      height: auto;
      flex-direction: column;

      .login-img {
        width: 100%;
        height: 220px;
      }

      .login-form {
        width: 100%;
        padding: 22px 24px 28px;

        h2 {
          margin-bottom: 22px;
          font-size: 22px;
        }

        form {
          gap: 20px;
        }
      }
    }
  }
}
@keyframes toright {
  0% {
    left: 10%;
  }
  100% {
    left: 180%;
  }
}
</style>
