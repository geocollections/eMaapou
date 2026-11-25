import VueMatomo from "vue-matomo";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.env.PROD)
    return;
  nuxtApp.vueApp.use(VueMatomo, {
    router: nuxtApp.$router,
    host: "https://matomo.geoloogia.info/",
    siteId: 1,
    debug: false,
    enableLinkTracking: true,
    trackInitialView: true,
    enableHeartBeatTimer: true,
  });
});
