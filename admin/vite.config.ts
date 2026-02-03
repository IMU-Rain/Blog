import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// Incoify图标集自动安装
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "icon", //自动引入的统一前缀，默认为i
        }),
      ],
    }),
    Icons({
      compiler: "vue3",
      customCollections: {
        // 如果有自定义图标集，可以在这里配置
      },
      defaultClass: "icon",
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {  
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["@iconify/json"],
  },
});
