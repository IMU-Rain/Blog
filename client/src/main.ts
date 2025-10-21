import { createApp } from "vue";
import App from "./App.vue";
import "./style/theme.less";
import router from "./router";
import mitt from "mitt";
import { VueMasonryPlugin } from "vue-masonry";
import { createPinia } from "pinia";
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.use(createPinia())
app.use(VueMasonryPlugin);
app.use(router);
app.mount("#app");
