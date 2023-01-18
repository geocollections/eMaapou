<template>
  <v-app dark>
    <app-drawer
      v-if="!$vuetify.breakpoint.mdAndUp"
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />
    <nuxt />
    <client-only>
      <cookie-consent />
    </client-only>
  </v-app>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue'
import CookieConsent from '~/components/CookieConsent.vue'
import AppDrawer from '~/components/AppDrawer.vue'

export default {
  components: {
    AppDrawer,
    CookieConsent,
    AppHeader,
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
