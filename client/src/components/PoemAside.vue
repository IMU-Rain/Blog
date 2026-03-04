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
    })
    .catch(() => {
      const defaultPoemData = {
        requestId: "1722517456527953920",
        code: 200,
        message: "正常响应",
        data: {
          quotes: "长安白日照春空，绿杨结烟垂袅风。",
          title: "阳春歌",
          content: null,
          dynasty: "唐",
          author: "李白",
          updateTime: null,
          createTime: null,
        },
      };
      poem.value = defaultPoemData;
    });
};
onMounted(() => {
  getPoem();
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.poem-aside {
  background: var(--surface-color);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  padding: 18px 16px;
  font-size: 15px;
  line-height: 1.75;
  font-weight: 400;

  .welcome-word {
    display: block;
    color: var(--text-color);
    margin: 0 0 14px;
    font-size: 16px;
    font-weight: 700;
    text-align: right;
  }
  .poem {
    color: var(--text-muted);
    .poem-content {
      margin: 0 0 8px;
      font-weight: 700;
      text-align: right;
      overflow-wrap: anywhere;
    }
    .poem-title {
      margin: 0;
      font-weight: 300;
      font-size: 13px;
      text-align: right;
    }
  }
}
</style>
