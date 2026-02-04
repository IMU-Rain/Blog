<script lang="ts" setup>
import DataCard from "./components/DataCard.vue";
const data = [
  { number: 100, icon: "fluent-color:people-interwoven-48", title: "visitors" },
];
</script>

<template>
  <div class="container">
    <div class="solgan">
      <h2>Welcome Back! 👏</h2>
      <h4>Hows Your Day</h4>
    </div>
    <div class="content">
      <ul class="cards">
        <li class="card"><DataCard :meta="data[0]" /></li>
        <li class="card"></li>
        <li class="card"></li>
        <li class="card"></li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  width: 70%;
  margin: 0 auto;
  .content {
    display: grid;
    grid-template-columns: repeat(1fr, 4);
    .cards {
    }
  }
}
</style>
