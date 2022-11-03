<template>
  <v-app dark>
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <app-header
      :drawer="drawer"
      transparent
      :show-search="false"
      :max-width="1185"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <v-main class="pt-0 pb-10" style="min-height: 100vh">
      <nuxt />
      <fab-scroll-top />
      <client-only>
        <cookie-consent />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '~/components/AppFooter.vue'
import CookieConsent from '~/components/CookieConsent.vue'
import AppDrawer from '~/components/AppDrawer.vue'
import AppHeader from '~/components/AppHeader.vue'
import FabScrollTop from '~/components/FabScrollTop.vue'
export default {
  components: {
    AppDrawer,
    AppHeader,
    FabScrollTop,
    CookieConsent,
    AppFooter,
  },
  data() {
    return {
      drawer: false,
    }
  },
}
</script>
