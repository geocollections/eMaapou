import isEqual from "lodash/isEqual";

export default defineNuxtRouteMiddleware((to, from) => {
  if (isEqual(to.query, from.query)) {
    const { onLoaded } = useScriptMatomoAnalytics();
    onLoaded((instance) => {
      instance._paq.push(["setCustomUrl", to.path]);
      instance._paq.push(["setDocumentTitle", to.meta.name]);
      instance._paq.push(["trackPageView"]);
      instance._paq.push(["enableLinkTracking"]);
      instance._paq.push(["enableHeartBeatTimer", 10]);
    });
  }
});
