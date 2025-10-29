<template>
  <aside class="poem-aside">
    <h3 class="welcome-word">
      你好, 欢迎来到Max Byte的博客!&nbsp;&nbsp;&nbsp;
    </h3>
    <div class="poem" v-if="poem">
      <p class="poem-content">{{ poem.quotes }}</p>
      <p class="poem-title">
        <i>{{ poem.title }}&nbsp;&nbsp;&nbsp;</i>
      </p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
const poem = ref();
const isCacheValid = (timestamp: number) => {
  const now = Date.now();
  const CACHE_EXPIRE_HOURS = 1;
  return now - timestamp < CACHE_EXPIRE_HOURS * 3600 * 1000;
};
const getPoem = () => {
  const cacheData = localStorage.getItem("POEM_CACHE");
  if (cacheData) {
    const parsed = JSON.parse(cacheData);
    if (isCacheValid(parsed.timestamp)) {
      poem.value = parsed.data;
      return;
    }
  }
  axios
    .get(
      "https://api.songzixian.com/api/daily-poem?dataSource=LOCAL_DAILY_POEM"
    )
    .then((res) => {
      if (res.status === 200) {
        poem.value = res.data.data;
        localStorage.setItem(
          "POEM_CACHE",
          JSON.stringify({ data: res.data.data, timestamp: Date.now() })
        );
      }
    });
};
onMounted(() => {
  getPoem();
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.poem-aside {
  background-color: @card-background-color;
  padding: 14px;
  font-size: 16px;
  height: fit-content;
  text-wrap: 0;
  font-weight: 400;
  text-wrap: nowrap;
  .welcome-word {
    display: block;
    color: @primary-color;
    margin-bottom: 20px;
    font-size: 16px;
    font-size: 700;
    text-align: right;
  }
  .poem {
    color: rgb(155, 155, 155);
    .poem-content {
      font-weight: 1000;
      text-align: right;
      text-wrap: wrap;
      margin-bottom: 10px;
    }
    .poem-title {
      font-weight: 300;
      font-size: 13px;
      text-align: right;
    }
  }
}
@media (prefers-color-scheme: dark) {
  .poem-aside {
    background-color: @dark-card-background-color;
    .welcome-word {
      color: @dark-accent-color;
    }
  }
}
</style>
