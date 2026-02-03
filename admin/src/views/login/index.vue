<script lang="ts" setup>
import MaxInput from "@/components/MaxInput.vue";
import MaxButton from "@/components/MaxButton.vue";
import { ref } from "vue";
import { login } from "@/api/account";
import { useRouter } from "vue-router";
const router=useRouter()
const loginData = ref({ username: "", password: "" });
const handleLogin = () => {
  login(loginData.value).then((res) => {
    if(res.code===200){
      router.push("/dashboard")
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
          ></MaxInput>
          <MaxInput
            v-model="loginData.password"
            placeholder="Password"
            type="password"
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
@import "@/style/index.less";
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
    width: 70%;
    height: 70%;
    border-radius: @card-roudend;
    box-shadow: @card-shadow;
    background-color: @card-background-color;
    display: flex;
    .login-img {
      height: 100%;
      max-width: 70%;
      border-radius: @card-roudend;
    }
    .login-form {
      padding: 5% 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h2 {
        margin-bottom: 50px;
        overflow: hidden;
        position: relative;
        &::after {
          content: "";
          width: 100%;
          height: 100%;
          background-color: @card-background-color;
          top: 0;
          left: 180%;
          transform: skew(-45deg);
          position: absolute;
          animation: toright 3s linear;
        }
      }
      form {
        display: flex;
        gap: 30px;
        flex-direction: column;
        align-items: center;
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
