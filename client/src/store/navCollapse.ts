import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavCollapse = defineStore("navCollapse", () => {
  const isCollapse = ref(false);
  const setCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
  return { isCollapse, setCollapse };
});
