<template>
  <div class="skeleton">Opps!!! Something wrong here.</div>
</template>

<script lang="ts" setup name="ErrorSkeleton"></script>

<style scoped lang="less">
.skeleton {
  font-weight: 1000;
  font-size: 50px;
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(
    90deg,
    black 0%,
    #888 30%,
    #fff 50%,
    #888 70%,
    black 80%
  );
  background-size: 400%;
  animation: shine 2s ease infinite;
}
@keyframes shine {
  0% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}
</style>
