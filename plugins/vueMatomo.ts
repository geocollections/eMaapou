import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Vue from 'vue'
import VueMatomo from 'vue-matomo'

// For configurations visit:  https://github.com/AmazingDreams/vue-matomo
export default defineNuxtPlugin(({ app }) => {
  Vue.use(VueMatomo, {
    router: app.router,
    host: 'https://matomo.geoloogia.info/',
    siteId: 1,
    requireCookieConsent: true,
    requireConsent: true,
    debug: process.env.NODE_ENV !== 'production',
  })

  const tag = document.querySelector(
    'script[src*="https://matomo.geoloogia.info//matomo.js"]'
  )
  tag?.setAttribute('type', 'text/partytown')
  tag?.setAttribute('crossorigin', 'anonymous')
})
