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
        <li class="nav-item nav-account-mobile">
          <button type="button" class="router-link" @click="handleAccountClick">
            {{ userStore.isLogged ? "退出" : "登录" }}
          </button>
        </li>
      </ul>
    </nav>
    <div class="account">
      <button
        v-if="!userStore.isLogged"
        type="button"
        class="account-btn"
        @click="userStore.openLoginModal"
      >
        登录
      </button>
      <div v-else class="account-profile">
        <span class="account-name" :title="displayName">
          {{ displayName }}
        </span>
        <button type="button" class="logout-btn" @click="handleLogout">
          退出
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { logout } from "../api/account";
import { useScrollsStore } from "../store/pinia";
import { useUserStore } from "../store/user";
const router = useRoute();
const scrollStore = useScrollsStore();
const userStore = useUserStore();
const displayName = computed(() => {
  return userStore.user?.nickname || userStore.user?.username || "用户";
});

const handleAccountClick = () => {
  if (!userStore.isLogged) {
    userStore.openLoginModal();
    return;
  }
  handleLogout();
};

const handleLogout = async () => {
  const confirmed = window.confirm("确认退出登陆？");
  if (!confirmed) return;
  await logout().catch(() => {});
  userStore.clearUser();
};
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
    gap: 100px;
    align-items: center;
    .nav-item {
      &.nav-account-mobile {
        display: none;
      }
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
  .account {
    display: flex;
    justify-content: flex-end;
    min-width: 180px;
    .account-btn {
      max-width: 130px;
      height: 38px;
      padding: 0 14px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 28%, var(--line-color));
      border-radius: 999px;
      color: var(--text-color);
      background: color-mix(in srgb, var(--panel-color) 74%, transparent);
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease;
      &:hover {
        transform: translateY(-1px);
        border-color: color-mix(
          in srgb,
          var(--primary-color) 54%,
          var(--line-color)
        );
        background: var(--primary-weak);
      }
    }
    .account-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 240px;
      min-width: 0;
      padding: 4px 4px 4px 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 26%, var(--line-color));
      border-radius: 999px;
      background: color-mix(in srgb, var(--panel-color) 62%, transparent);
    }
    .account-name {
      min-width: 0;
      max-width: 130px;
      color: var(--text-color);
      font-size: 14px;
      font-weight: 800;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .logout-btn {
      flex: 0 0 auto;
      height: 30px;
      padding: 0 12px;
      border-radius: 999px;
      color: var(--surface-color);
      background: var(--primary-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition:
        transform 0.2s ease,
        opacity 0.2s ease,
        box-shadow 0.2s ease;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 14px var(--shadow-color);
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
        &.nav-account-mobile {
          display: block;
        }
        .router-link {
          width: 100%;
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
    .account {
      display: none;
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
