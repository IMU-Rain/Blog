declare module "markdown-it-table-of-contents" {
  import type { PluginSimple } from "markdown-it";

  interface TocOptions {
    includeLevel?: number[];
    containerClass?: string;
    listType?: "ul" | "ol";
    markerPattern?: RegExp;
    format?: (heading: string) => string;
    slugify?: (str: string) => string;
  }

  const toc: PluginSimple & {
    default: PluginSimple;
  };

  export default function toc(md: any, options?: TocOptions): void;
}
