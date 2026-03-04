<template>
  <div
    class="container"
    :class="{ sticky: scrollStore.isScroll }"
    v-if="!router.meta?.requireAdmin"
  >
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
import { useRoute } from "vue-router";
import { useScrollsStore } from "../store/pinia";
const router = useRoute();
const scrollStore = useScrollsStore();
</script>

<style scoped lang="less">
@import "../style/theme.less";
.container {
  position: relative;
  margin: 16px auto 28px;
  width: min(1280px, 94vw);
  padding: 14px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: color-mix(in srgb, var(--surface-color) 92%, transparent);
  border: 1px solid var(--line-color);
  border-radius: 16px;
  box-shadow: 0 8px 18px var(--shadow-color);
  backdrop-filter: blur(8px);
  transition:
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    transform 0.22s ease,
    background-color 0.22s ease;
  .title {
    font-weight: 800;
    font-size: 28px;
    letter-spacing: 0.06em;
    cursor: pointer;
    a {
      color: var(--text-color);
      transition: color 0.2s ease;
    }
    a:hover {
      color: var(--primary-color);
    }
  }
  nav > ul {
    display: flex;
    gap: 8px;
    align-items: center;
    .nav-item {
      .router-link {
        position: relative;
        display: block;
        padding: 10px 16px;
        border-radius: 12px;
        font-size: 17px;
        font-weight: 600;
        color: var(--text-muted);
        letter-spacing: 0.08em;
        transition:
          color 0.2s ease,
          background-color 0.2s ease,
          transform 0.2s ease;
        -webkit-tap-highlight-color: transparent;
        background-color: transparent;
        &::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 6px;
          height: 2px;
          border-radius: 99px;
          background: var(--primary-color);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        &:hover {
          color: var(--text-color);
          background: color-mix(in srgb, var(--panel-color) 78%, transparent);
        }
        &.active {
          color: var(--text-color);
          background: color-mix(in srgb, var(--panel-color) 76%, transparent);
        }
        &.active::after {
          transform: scaleX(1);
        }
      }
    }
  }
  &.sticky {
    position: sticky;
    top: 12px;
    z-index: 1000;
    border-color: color-mix(in srgb, var(--primary-color) 32%, var(--line-color));
    box-shadow: 0 12px 28px color-mix(in srgb, var(--shadow-color) 88%, transparent);
  }
}
@media (max-width: 900px) {
  .container {
    width: min(1280px, 96vw);
    padding: 12px 16px;
    .title {
      font-size: 22px;
    }
    nav > ul {
      .nav-item {
        .router-link {
          font-size: 15px;
          padding: 8px 12px;
          letter-spacing: 0.05em;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    margin: 0;
    position: fixed;
    left: 50%;
    bottom: 12px;
    top: auto;
    transform: translateX(-50%);
    width: min(540px, 92vw);
    padding: 10px 12px;
    border-radius: 999px;
    justify-content: center;
    z-index: 1000;
    nav {
      width: 100%;
    }
    nav > ul {
      gap: 6px;
      justify-content: space-between;
      .nav-item {
        flex: 1;
        .router-link {
          text-align: center;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 10px 6px;
          &::after {
            left: 16px;
            right: 16px;
            bottom: 4px;
          }
        }
      }
    }
    &.sticky {
      position: fixed;
      top: auto;
      box-shadow: 0 12px 26px color-mix(in srgb, var(--shadow-color) 90%, transparent);
    }
  }
  .title {
    display: none;
  }
}
</style>
