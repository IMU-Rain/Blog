<template>
  <div class="article-container">
    <el-card>
      <template #header>
        <el-button @click="handleDialog">新增文章</el-button>
      </template>
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
    </el-card>
    <div class="dialog" v-if="isDialogShow">
      <el-form v-model="formData" label-width="200px" size="large">
        <el-button
          @click="isDialogShow = false"
          type="danger"
          circle
        ></el-button>
        <el-form-item label="title">
          <el-input
            v-model="formData.title"
            style="width: 300px; height: 30px"
          />
        </el-form-item>
        <el-form-item label="cover">
          <el-input
            v-model="formData.title"
            style="width: 300px; height: 30px"
          />
        </el-form-item>
        <el-form-item label="标签(请使用逗号分隔)">
          <el-input
            v-model="formData.title"
            style="width: 300px; height: 30px"
          />
        </el-form-item>
        <el-form-item label="文章内容">
          <ArticleEdit :target="formData"></ArticleEdit>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
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
// 新增文章
const isDialogShow = ref(false);
const formData = ref({ title: "", content: "123" });
const handleDialog = () => {
  isDialogShow.value = true;
};
onMounted(() => {
  const baseURL = axios.defaults.baseURL?.slice(
    0,
    axios.defaults.baseURL.length - 3
  );
  run().then(() => {
    tableDatas.value?.map((tableData) => {
      tableData.url = `${baseURL}${tableData.url}`;
    });
  });
});
</script>

<style scoped lang="less">
@import "../../style/theme.less";
.article-container {
  padding: 1rem;
  overflow: scroll;
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #555;
    z-index: 9999;
    .el-form {
      margin: 5rem auto;
      width: 80%;
      height: 80%;
      overflow: scroll;
      scrollbar-color: transparent transparent;
      background-color: @card-background-color;
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: flex-start;
      border-radius: 3rem;
      .el-button {
        width: 20px;
        height: 100%;
        margin-left: 30px;
        margin-top: 30px;
      }
      .md-editor {
        height: 500px;
        width: 800px;
      }
    }
  }
}
</style>
