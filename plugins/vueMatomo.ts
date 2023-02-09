import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Vue from 'vue'
import VueMatomo from 'vue-matomo'

// For configurations visit:  https://github.com/AmazingDreams/vue-matomo
export default defineNuxtPlugin(({ app }) => {
  if (process.env.NODE_ENV === 'production') {
    Vue.use(VueMatomo, {
      router: app.router,
      host: 'https://matomo.geoloogia.info/',
      siteId: 1,
      requireCookieConsent: true,
      requireConsent: false,
      debug: process.env.NODE_ENV !== 'production',
      enableLinkTracking: process.env.NODE_ENV === 'production',
      trackInitialView: process.env.NODE_ENV === 'production',
      enableHeartBeatTimer: true,
    })
  }
})
