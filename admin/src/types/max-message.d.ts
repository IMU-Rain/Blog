declare interface MaxMessageOptions {
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
}

declare const MaxMessage: (options: MaxMessageOptions) => void;

declare interface Window {
  MaxMessage: typeof MaxMessage;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $maxMessage: typeof MaxMessage;
  }
}

export {};
