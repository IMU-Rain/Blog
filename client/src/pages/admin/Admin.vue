<template>
  <div class="common-layout">
    <el-container>
      <el-aside height="100vh">
        <el-row>
          <el-col>
            <h3 class="mb-2">
              <img src="../../assets/faze_logo.svg" />
              {{ collapseStore.isCollapse ? "" : "MaxByte" }}
            </h3>
            <el-menu
              class="el-menu-vertical-demo"
              :router="true"
              :collapse="collapseStore.isCollapse"
              :default-active="getRoute()"
            >
              <el-menu-item index="/admin/dashboard">
                <el-icon><DataBoard /></el-icon>
                <span>DashBoard</span>
              </el-menu-item>
              <el-menu-item index="/admin/articles">
                <el-icon><Document /></el-icon>
                <span>Article</span>
              </el-menu-item>
              <el-menu-item index="/admin/albums">
                <el-icon><Picture /></el-icon>
                <span>Albums</span>
              </el-menu-item>
              <el-menu-item index="/admin/duxiuIndex">
                <el-icon><Coin /></el-icon>
                <span>DuxiuIndex</span>
              </el-menu-item>
              <el-menu-item index="/admin/about">
                <el-icon><User /></el-icon>
                <span>About</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header><Header /></el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useNavCollapse } from "../../store/navCollapse";
import Header from "./Header.vue";
import router from "../../router";
const collapseStore = useNavCollapse();
const getRoute = () => {
  return router.currentRoute.value.path
};
</script>

<style scoped lang="less">
@import "../../style/theme.less";
.common-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  .el-aside {
    height: 100vh;
    background-color: #fff;
    border-right: 1px solid rgb(220, 223, 230);
    border-collapse: collapse;
    width: inherit;
    h3 {
      font-size: 32px;
      border-bottom: 1px solid rgb(220, 223, 230);
      user-select: none;
      color: @primary-color;
      line-height: 60px;
      margin-bottom: 10px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 30px;
      }
    }
    .el-menu {
      border: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      width: 240px;
      text-align: center;
      &.el-menu--collapse {
        width: 60px;
        .el-menu-item {
          display: flex;
          justify-content: center;
        }
      }
      .el-menu-item {
        width: 80%;
        color: @accent-color;
        user-select: none;
        border-radius: 10px;
        font-size: 20px;
        transition: all 0.5s ease;
        letter-spacing: 1px;
        &.is-active {
          background-color: rgb(187 255 255);
        }
      }
    }
  }
  .el-header {
    height: 60px;
    border-bottom: 1px solid rgb(220, 223, 230);
  }
  .el-main {
    background-color: @background-color;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
