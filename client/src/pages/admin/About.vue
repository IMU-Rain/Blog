<template>
  <ArticleEdit :target="aboutContnet" v-if="aboutContnet" />
  <el-button size="large" @click="submit">提交</el-button>
</template>

<script setup lang="ts">
import ArticleEdit from "../../components/admin/ArticleEdit.vue";
import { useRequest } from "../../hooks/useRequest";
import { getAbout, updateAbout } from "../../api/about";
const { data: aboutContnet, run: getData } = useRequest(getAbout, {
  immediate: true,
});
const { data: res, run } = useRequest(updateAbout);
const submit = () => {
  run(aboutContnet.value.content).then(() => {
    console.log(res.value);
    getData();
  });
};
</script>
<style>
.el-button {
  width: 80%;
  margin: 20px;
  transform: translateX(10%);
  height: 100px;
}
</style>
