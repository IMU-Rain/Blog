import { defineStore } from "pinia";
import type { user } from "../types/user";
import { ref } from "vue";
export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<null | user>(null);
    const isLogged = ref(false);
    const isLoginModalOpen = ref(false);
    const setUser = (data: user) => {
      user.value = data;
      isLogged.value = true;
    };
    const clearUser = () => {
      user.value = null;
      isLogged.value = false;
    };
    const openLoginModal = () => {
      isLoginModalOpen.value = true;
    };
    const closeLoginModal = () => {
      isLoginModalOpen.value = false;
    };
    return {
      user,
      setUser,
      clearUser,
      isLogged,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
    };
  },
  {
    persist: {
      pick: ["user", "isLogged"],
    },
  },
);
