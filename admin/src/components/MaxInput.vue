<script lang="ts" setup>
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { colorToRgba } from "@/utils/color";

const data = defineModel<string>();
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    type?: string;
    icon?: string;
    color?: string;
    height?: number | string;
  }>(),
  {
    placeholder: "",
    type: "text",
    color: "#4f7fb7",
    height: 18,
  },
);

const iconSize = computed(() => Number(props.height));
const inputHeight = computed(() => `${Math.max(Number(props.height) + 22, 40)}px`);
const borderColor = computed(() => props.color);
const backgroundColor = computed(() => colorToRgba(props.color, 0.1));
</script>

<template>
  <div
    class="input-wrap"
    :style="{
      '--input-height': inputHeight,
      '--input-border': borderColor,
      '--input-bg': backgroundColor,
    }"
  >
    <Icon
      v-if="props.icon"
      :icon="props.icon"
      :width="iconSize"
      class="input-icon"
    />
    <input
      :type="props.type"
      class="input"
      v-model="data"
      :placeholder="props.placeholder"
    />
  </div>
</template>

<style scoped lang="less">
.input-wrap {
  width: 100%;
  height: var(--input-height);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 2px solid var(--input-border);
  background: var(--input-bg);
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:focus-within {
    box-shadow: 0 8px 18px var(--primary-weak);
    transform: translateY(-1px);
  }
}

.input-icon {
  color: var(--input-border);
  flex-shrink: 0;
}

.input {
  width: 100%;
  height: 100%;
  border: none;
  padding: 0;
  color: var(--text-color);
  background: transparent;
  outline: none;

  &::placeholder {
    color: color-mix(in srgb, var(--text-muted) 80%, transparent);
  }
}
</style>
