declare module "markdown-it-attrs" {
  import type { PluginSimple } from "markdown-it";

  interface MarkdownItAttrsOptions {
    /**
     * 是否允许在所有块级元素上使用属性
     */
    leftDelimiter?: string;
    rightDelimiter?: string;
    allowedAttributes?: string[];
  }

  const markdownItAttrs: PluginSimple & {
    (md: any, options?: MarkdownItAttrsOptions): void;
  };

  export default markdownItAttrs;
}