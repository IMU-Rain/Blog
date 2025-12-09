import { createApp } from "vue";
import App from "./App.vue";
import "./style/theme.less";
import router from "./router";
import mitt from "mitt";
import { VueMasonryPlugin } from "vue-masonry";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.use(ElementPlus, { size: "small" });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(VueMasonryPlugin);
app.use(router);
app.mount("#app");
