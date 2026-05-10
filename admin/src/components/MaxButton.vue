<script lang="ts" setup>
import { colorToRgba } from "@/utils/color";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
const props = withDefaults(
  defineProps<{ height: number|string; color: string; icon: string }>(),
  {
    height: 18,
    color: "text",
    icon: "#4f7fb7",
  },
);
const fontSize = props.height + "px";
const gap = Number(props.height) / 2.5 + "px";
const backgroundColor = computed(() => colorToRgba(props.color, 0.1));
</script>

<template>
  <button
    :style="{
      fontSize: fontSize,
      color: color,
      borderColor: color,
      backgroundColor: backgroundColor,
    }"
    type="button"
    class="button-container"
  >
    <Icon
      v-if="icon"
      :icon
      :width="height"
      :style="{ marginRight: gap, color: color }"
    ></Icon>
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
@import "@/style/mixin.less";
.button-container {
  border: 2px solid var(--line-color);
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  .iconify {
    margin-right: 15px;
  }
}

button {
  border-radius: 15px;
  cursor: pointer;
  transition: 0.2s all ease;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 18px var(--shadow-color);
  }
}

.relex {
  background-color: #717775;
  color: white;
}
</style>
