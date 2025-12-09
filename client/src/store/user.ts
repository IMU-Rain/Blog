import { defineStore } from "pinia";
import type { user } from "../types/user";
import { ref } from "vue";
export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<null | user>(null);
    const isLogged = ref(false);
    const setUser = (data: user) => {
      user.value = data;
      isLogged.value = true;
    };
    return { user, setUser, isLogged };
  },
  {
    persist: true,
  }
);
