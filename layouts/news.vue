<template>
  <v-app dark>
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />

    <v-main style="min-height: 100vh">
      <v-container class="pb-10">
        <nuxt />
        <fab-scroll-top />
      </v-container>
      <client-only>
        <cookie-consent />
      </client-only>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
import FabScrollTop from '~/components/FabScrollTop.vue'
import CookieConsent from '~/components/CookieConsent.vue'
import AppDrawer from '~/components/AppDrawer.vue'

export default {
  components: {
    AppDrawer,
    CookieConsent,
    AppHeader,
    AppFooter,
    FabScrollTop,
  },
  data() {
    return {
      drawer: false,
    }
  },
  watch: {
    '$vuetify.breakpoint.mdAndUp'(newVal, oldVal) {
      if (newVal && !oldVal) this.drawer = false
    },
  },
}
</script>
