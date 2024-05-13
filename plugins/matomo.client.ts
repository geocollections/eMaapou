/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable node/prefer-global/process */
// @ts-expect-error - There is no types defined for this package
import VueMatomo from "vue-matomo";

// For configurations visit:  https://github.com/AmazingDreams/vue-matomo
export default defineNuxtPlugin((nuxtApp) => {
  if (process.env.NODE_ENV !== "production")
    return;
  nuxtApp.vueApp.use(VueMatomo, {
    router: nuxtApp.$router,
    host: "https://matomo.geoloogia.info/",
    siteId: 1,
    debug: process.env.NODE_ENV !== "production",
    enableLinkTracking: process.env.NODE_ENV === "production",
    trackInitialView: process.env.NODE_ENV === "production",
    enableHeartBeatTimer: true,
  });
});
