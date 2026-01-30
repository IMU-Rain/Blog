<script lang="ts" setup>
const { size, color } = defineProps(["size", "color"]);
</script>

<template>
  <button :class="[size, color]" type="button"><slot></slot></button>
</template>

<style scoped lang="less">
@import "@/style/mixin.less";
button {
  border-radius: @button-roudend;
  padding: 50px 10px;
  cursor: pointer;
  transition: 0.3s all ease;
  &:hover {
    opacity: 0.8;
  }
}
.large {
  height: 50px;
  width: 100%;
}

.relex {
  background-color: #717775;
  color: white;
}
</style>
