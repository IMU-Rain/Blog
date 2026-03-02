import { createApp } from "vue";
import type { App } from "vue";
import Toast from "./Toast.vue";

export interface MaxMessageOptions {
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
}

const ensureHost = () => {
  let host = document.getElementById("max-message-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "max-message-host";
    host.style.position = "fixed";
    host.style.top = "18px";
    host.style.left = "50%";
    host.style.transform = "translateX(-50%)";
    host.style.zIndex = "3000";
    host.style.display = "flex";
    host.style.flexDirection = "column";
    host.style.alignItems = "center";
    host.style.gap = "10px";
    host.style.pointerEvents = "none";
    document.body.appendChild(host);
  }
  return host;
};

const MaxMessage = (options: MaxMessageOptions) => {
  const host = ensureHost();
  const mountPoint = document.createElement("div");
  mountPoint.style.pointerEvents = "auto";
  host.appendChild(mountPoint);

  const app = createApp(Toast, {
    ...options,
    onDestroy: () => {
      app.unmount();
      mountPoint.remove();
      if (!host.childElementCount) {
        host.remove();
      }
    },
  });

  app.mount(mountPoint);
};

export const installMaxMessage = (app: App) => {
  app.config.globalProperties.$maxMessage = MaxMessage;
  (window as any).MaxMessage = MaxMessage;
  (globalThis as any).MaxMessage = MaxMessage;
};

export default MaxMessage;
