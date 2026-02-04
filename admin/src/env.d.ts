// src/env.d.ts
/// <reference types="vite/client" />
// 解决 unplugin-icons 的 ~icons 模块类型报错
declare module "~icons/*" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
// 解决通用 Icon 组件的 ~icons 导入报错
declare module "~icons" {
  import type { DefineComponent } from "vue";
  export const Icon: DefineComponent<
    {
      icon: string;
      size?: string | number;
      color?: string;
    },
    {},
    any
  >;
}
