declare module "markdown-it-task-lists" {
  import type { PluginSimple } from "markdown-it";

  interface TaskListOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }

  const taskLists: PluginSimple & {
    (md: any, options?: TaskListOptions): void;
  };

  export default taskLists;
}