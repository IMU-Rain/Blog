import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
import "@/style/index.less";
import router from "@/router/index";
import { applyThemeMode, getStoredThemeMode } from "@/utils/theme";
import { installMaxMessage } from "@/components/MaxMessage";

applyThemeMode(getStoredThemeMode());

const app = createApp(App);
app.use(router);
installMaxMessage(app);
app.mount("#app");
