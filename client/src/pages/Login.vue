<template>
  <div class="login-container">
    <h3>Wellcome back,Max</h3>
    <form @submit.prevent="handleSubmit" class="login-form">
      <input
        type="text"
        name="username"
        autofocus
        placeholder="username"
        v-model="formData.username"
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        v-model="formData.password"
        @keyup.enter="handleSubmit"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useRequest } from "../hooks/useRequest";
import { getUserInfo, login } from "../api/login";
import { useUserStore } from "../store/user";
import router from "../router";
import { Message } from "../components/Messge";
const { run } = useRequest(login);
const formData = reactive({
  username: "",
  password: "",
});
const validateForm = (): boolean => {
  if (formData.username.trim() === "" || formData.password.trim() === "") {
    Message.error("请不要瞎填写");
    return false;
  }
  return true;
};

const userStore = useUserStore();
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  } else {
    run(formData).then(() => {
      getUserInfo().then((data) => {
        userStore.setUser(data);
        router.push("/admin/dashboard");
      });
    });
  }
};
</script>

<style scoped lang="less">
.login-container {
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  h3 {
    font-size: 30px;
    letter-spacing: 2px;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
    input {
      border: 3px solid rgba(125, 125, 125, 0.3);
      padding: 15px 20px;
      font-size: 20px;
      letter-spacing: 1px;
      border-radius: 9999px;
      caret-color: rgba(125, 125, 125, 1);
    }
  }
}
</style>
