<template>
  <div class="article-container">
    <el-table :data="tableDatas" style="width: 100%" stripe size="large">
      <el-table-column prop="id" label="id" width="280" />
      <el-table-column prop="title" label="Title" width="200" />
      <el-table-column prop="createAt" label="Name" width="300" />
      <el-table-column prop="url" label="cover" />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id, scope.row.title)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { delArticle, getArticles } from "../../api/article";
import { useRequest } from "../../hooks/useRequest";
import axios from "../../api/axios";
import type { ArticleRaw } from "../../types/article";
import { Message } from "../../components/Messge";
import router from "../../router";

const { data: tableDatas, run } = useRequest<[ArticleRaw]>(getArticles);
const handleDelete = (id: string, title: string) => {
  if (confirm(`是否删除文章《${title}》?`))
    delArticle({ id })
      .then((code) => {
        if (code === 200) {
          Message.success("删除成功");
        } else if (code === 401) {
          return router.push("/login");
        }
      })
      .finally(() => run())
      .catch(({ status }) => {
        if (status === 401) {
          Message.error("登陆状态失效, 返回登陆页面重新登陆");
          router.push("/login");
        }
      });
};
onMounted(() => {
  const baseURL = axios.defaults.baseURL?.slice(
    0,
    axios.defaults.baseURL.length - 4
  );
  run().then(() => {
    tableDatas.value?.map((tableData) => {
      tableData.url = `${baseURL}${tableData.url}`;
    });
  });
});
</script>

<style scoped lang="less">
.article-container {
  padding: 1rem;
  overflow: scroll;
}
</style>
