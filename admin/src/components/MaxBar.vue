<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

// 1. 显式定义TS类型，初始化值可设为空（后续会覆盖）
const leftY = ref<string>("0px");
// 获取当前路由实例
const route = useRoute();

// 封装：根据索引计算指示器left值（复用核心逻辑）
const calcIndicatorLeft = (index: number) => {
  leftY.value = `${25 * (index - 1) + 12.5}%`;
};

// 路由和索引的映射表（核心：和RouterLink的to一一对应）
const routeToIndex = new Map([
  ["/Dashboard", 1],
  ["/Articles", 2],
  ["/Albums", 3],
  ["/About", 4],
]);

// 封装：根据当前路由获取对应索引，设置位置
const setLeftByRoute = () => {
  const index = routeToIndex.get(route.path);
  if (index) calcIndicatorLeft(index);
};

// 2. 页面初始化：根据当前路由设置初始位置（解决刷新/直接访问无位置问题）
onMounted(() => {
  nextTick(() => {
    setLeftByRoute();
  });
});

// 3. 监听路由切换（包括浏览器回退/前进）：同步更新位置
onBeforeRouteUpdate((to) => {
  // 路由切换后，更新当前路由并重新计算位置
  const index = routeToIndex.get(to.path);
  if (index) calcIndicatorLeft(index);
});
</script>

<template>
  <div class="container">
    <ul>
      <li>
        <RouterLink to="/Dashboard"
          ><icon-ic:outline-home /><span>Dashboard</span></RouterLink
        >
      </li>
      <li>
        <RouterLink to="/Articles"
          ><icon-fluent:content-view-24-regular /><span
            >Articles</span
          ></RouterLink
        >
      </li>
      <li>
        <RouterLink to="/Albums"
          ><icon-tabler:photo /><span>Albums</span></RouterLink
        >
      </li>
      <li>
        <RouterLink to="/About"
          ><icon-tabler-user-circle /><span>About</span></RouterLink
        >
      </li>
      <div class="indicator" :style="{ left: leftY }"></div>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import "@/style/index.less";
.container {
  width: 70%;
  height: 80px;
  background-color: @card-background-color;
  border-radius: 9999px;
  padding: 0 20px;
  & > ul {
    display: grid;
    position: relative;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    height: 100%;
    & > li {
      height: 100%;
      a {
        display: flex;
        text-align: center;
        flex-direction: column;
        letter-spacing: 1px;
        font-size: 24px;
        justify-content: center;
        align-items: center;
        position: relative; /* 作为 span 绝对定位的参考 */
        width: 100%;
        height: 100%;
        .icon {
          transition: 0.5s;
          display: block;
          font-size: 1.5em;
          position: relative;
          height: 80px;
          z-index: 1;
        }
        span {
          transition: 0.5s;
          font-weight: 400;
          font-size: 24px;
          transform: translateY(20px);
          position: absolute;
          opacity: 0;
        }
        &.router-link-active > .icon {
          transform: translateY(-45px);
        }
        &.router-link-active > span {
          transform: translateY(10px);
          opacity: 1;
        }
      }
    }
    & > .indicator {
      width: 80px;
      top: -55%;
      height: 80px;
      position: absolute;
      transition: 0.5s;
      border: 8px solid @background-color;
      background-color: #29fd53;
      transform: translateX(-50%);
      border-radius: 50%;
    }
  }
}
@media (prefers-color-scheme: dark) {
  .container {
    ul > {
      .indicator {
        border: 6px solid #121212;
      }
    }
  }
}
</style>
