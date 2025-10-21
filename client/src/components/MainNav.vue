<template>
  <div class="container" :class="{ sticky: scrollStore.isScroll }">
    <div class="title">
      <router-link to="/">Max Byte</router-link>
    </div>
    <nav>
      <ul>
        <li class="nav-item">
          <router-link to="/" active-class="active" class="router-link"
            >首页</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/albums" active-class="active" class="router-link"
            >照片</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/about" active-class="active" class="router-link"
            >关于</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useScrollsStore } from "../store/pinia";
const scrollStore = useScrollsStore();
const handleScroll = () => {
  scrollStore.updateScroll(window.scrollY);
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
  width: 100%;
  padding: 30px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: @card-background-color;
  transition: all 0.8s ease;
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
      .router-link {
        &::after {
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
        &:hover::after {
          transform: scale(1);
        }
        .active {
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
        .router-link {
          &::after {
            background-color: @dark-text-color;
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
