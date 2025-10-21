<template>
  <div class="container" :class="{ sticky: isSticky }">
    <div class="title">
      <router-link to="/">Max Byte</router-link>
    </div>
    <nav>
      <ul>
        <li class="nav-item">
          <router-link to="/" active-class="active">首页</router-link>
        </li>
        <li class="nav-item" active-class="active">
          <router-link to="/albums">照片</router-link>
        </li>
        <li class="nav-item" active-class="active">
          <router-link to="/about">关于</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
const isSticky = ref(false);
const handleScroll = () => {
  isSticky.value = window.scrollY > 0;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  margin-bottom: 40px;
  width: max(100%, 99vw);
  padding: 30px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: @card-background-color;
  .title {
    font-weight: 700;
    font-size: 30px;
    cursor: pointer;
  }
  nav > ul {
    display: flex;
    gap: 40px;
    font-size: 24px;
    align-items: center;
    .nav-item {
      overflow: hidden;
      cursor: pointer;
      opacity: 0.8;
      letter-spacing: 3px;
      position: relative;
    }
    .nav-item::after {
      content: "";
      width: 100%;
      position: absolute;
      height: 3px;
      background-color: @text-color;
      left: 0;
      bottom: 0;
      transform: scale(0);
      transition: transform 0.3s ease;
    }
    .nav-item:hover::after {
      transform: scale(1);
    }
    .nav-item.active {
      opacity: 1;
    }
    .theme-toggle {
      background-color: transparent;
      color: white;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
  &.sticky {
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
}
@media (max-width: 768px) {
  .container {
    padding: 15px 0px;
    justify-content: center;
  }
  .title {
    display: none;
  }
}
@media (prefers-color-scheme: dark) {
  .container {
    background-color: @dark-card-background-color;
    nav > ul {
      .nav-item {
        color: @dark-primary-color;
        &::after {
          background-color: @dark-primary-color;
        }
      }
    }
  }
}
</style>
