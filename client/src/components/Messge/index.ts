import { createVNode, render } from "vue";
import MessageComponent from "./Message.vue";

interface MessageOptions {
  message: string;
  type?: "info" | "success" | "error";
  duration?: number;
}

let seed = 0;
const instances: any[] = [];

function createMessage({
  message,
  type = "info",
  duration = 2000,
}: MessageOptions) {
  const container = document.createElement("div");
  container.className = "message-wrapper";
  document.body.appendChild(container);

  const vm = createVNode(MessageComponent, { message, type, duration });

  render(vm, container);

  const id = seed++;
  instances.push({ id, vm, container });

  setTimeout(() => {
    render(null, container);
    document.body.removeChild(container);
  }, duration + 300);
}

export const MessageApi = {
  info(message: string) {
    createMessage({ message, type: "info" });
  },
  success(message: string) {
    createMessage({ message, type: "success" });
  },
  error(message: string) {
    createMessage({ message, type: "error" });
  },
};

export const Message = MessageApi;
