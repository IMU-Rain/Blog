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
import { useScrollsStore } from "../store/pinia";
const scrollStore = useScrollsStore();
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
      letter-spacing: 3px;
      position: relative;
      .router-link {
        transition: all 0.3s ease;
        &::after {
          content: "";
          width: 100%;
          position: absolute;
          height: 3px;
          background-color: @text-color;
          left: 0;
          bottom: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }
        &.active::after {
          opacity: 0.8;
          transform: scale(1);
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
    backdrop-filter: blur(3px);
    padding: 2% 5%;
    justify-content: center;
    position: fixed;
    top: 99%;
    width: 80%;
    transform: translateY(-100%);
    left: 10%;
    z-index: 1000;
    border-radius: 40px;
    margin-bottom: 0;
    opacity: 0.85;
    overflow: visible;
    height: fit-content;
    nav {
      height: fit-content;
      width: 100%;
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
        gap: 15%;
        .nav-item {
          overflow: visible;
          .router-link {
            padding: 15px 0px;
            width: 100%;
            display: block;
            user-select: none;
            filter: blur(1px);
            &:active {
              background-color: transparent;
            }
            &::after {
              width: 180%;
              bottom: 2.5%;
              left: -45%;
              height: 95%;
              border-radius: 35px;
              background-color: transparent;
            }
            &.active {
              animation: scale 0.4s;
              transform: scale(1.1);
              filter: none;
            }
            &.active::after {
              opacity: 0.8;
              transform: scale(1.1);
              animation: scale 0.4s;
            }
          }
        }
      }
    }
    &.sticky {
      position: fixed;
      top: 99%;
    }
  }
  .title {
    display: none;
  }
  @keyframes scale {
    0% {
      transform: scale(0.9);
    }
    25% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
}
@media (prefers-color-scheme: dark) {
  @media (max-width: 768px) {
    .container {
      nav > ul {
        .nav-item {
          .router-link {
            &::after {
              background-color: transparent;
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
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
