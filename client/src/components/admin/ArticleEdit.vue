<template>
  <MdEditor v-model="prop.target.content" @on-upload-img="onUploadImg" />
</template>

<script setup>
import { ref, watch } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { stringifyQuery } from "vue-router";
import { ArticleImageSendApi } from "../../api/AtricleImage";
import { useRequest } from "../../hooks/useRequest";

const containImg = ref([]);
const prop = defineProps(["target"]);
const submit = () => {
  prop.target.containImg = containImg.value;
};
const onUploadImg = async (files, callback) => {
  const { data, run } = useRequest(ArticleImageSendApi);
  const res = run(files).then((res) => {
    containImg.value.push(item.detail.id);
    callback(res.map((item) => item.detail.url));
  });
};
</script>
<style lang="less">
.md-editor {
  height: 100%;
  width: 50%;
}
</style>
