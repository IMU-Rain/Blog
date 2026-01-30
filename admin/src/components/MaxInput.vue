<script lang="ts" setup>
const data = defineModel();
const { placeholder, type } = defineProps(["placeholder", "type"]);
</script>

<template>
  <input
    :type="type || 'text'"
    class="input"
    v-model="data"
    :placeholder="placeholder"
  />
</template>

<style scoped lang="less">
@import "@/style/index.less";
.input {
  width: 100%;
  height: 30px;
  border-bottom: 3px solid #888;
  padding: 0 10px;
  color: @text-color;
}
</style>
