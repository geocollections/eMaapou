declare module "wellio" {
  const wellio: {
    las2json: (content: string) => Record<string, unknown>;
  };
  export default wellio;
}

declare module "vue-matomo" {
  import type { Plugin } from "vue";
  import type { Router } from "vue-router";

  const VueMatomo: Plugin<[{
    router: Router;
    host: string;
    siteId: number;
    debug: boolean;
    enableLinkTracking: boolean;
    trackInitialView: boolean;
    enableHeartBeatTimer: boolean;
  }]>;
  export default VueMatomo;
}
