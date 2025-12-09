<template>
  <div class="header-container">
    <div class="collapse-btn btn" @click="collapse">
      <el-icon size="30"><Fold /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNavCollapse } from "../../store/navCollapse";

const navCollapse = useNavCollapse();
const collapse = () => {
  navCollapse.setCollapse();
  console.log(navCollapse.isCollapse);
};
</script>

<style scoped lang="less">
.header-container {
  display: flex;
  align-items: center;
  padding: 10px;
  padding-left: 20px;

  .btn {
    height: 30px;
    cursor: pointer;
  }
}
</style>
