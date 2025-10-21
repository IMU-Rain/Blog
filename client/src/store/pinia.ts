import { defineStore } from "pinia";
import { ref } from "vue";

export const useScrollsStore = defineStore("scroll", () => {
  const isScroll = ref(false);
  const updateScroll = (scrollY: number) => {
    isScroll.value = scrollY > 0;
  };
  return { isScroll, updateScroll };
});
