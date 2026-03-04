<template>
  <div class="skeleton">Opps!!! Something wrong here.</div>
</template>

<script lang="ts" setup name="ErrorSkeleton"></script>

<style scoped lang="less">
@import "../style/theme.less";
.skeleton {
  padding: 42px 20px;
  text-align: center;
  font-weight: 700;
  font-size: clamp(22px, 4vw, 38px);
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(
    100deg,
    color-mix(in srgb, var(--text-muted) 76%, transparent) 0%,
    var(--text-color) 42%,
    color-mix(in srgb, var(--text-muted) 76%, transparent) 78%
  );
  background-size: 400%;
  animation: shine 1.8s ease infinite;
}
@keyframes shine {
  0% {
    background-position: 100% center;
  }
  100% {
    background-position: -100% center;
  }
}
</style>
