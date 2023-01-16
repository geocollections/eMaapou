<template>
  <v-app dark>
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />

    <!-- <v-main style="min-height: 100vh">
      <v-container
        class="pt-1 pb-10"
        style="height: 100%"
        :fluid="$vuetify.breakpoint.lgAndDown"
      >
        <v-row no-gutters>
          <v-col>
            <client-only>
              <history-viewer v-if="$vuetify.breakpoint.smAndUp" />
            </client-only>
          </v-col>
        </v-row> -->
    <nuxt />
    <!-- <fab-scroll-top />
      </v-container>
      <client-only>
        <cookie-consent />
      </client-only>
    </v-main> -->
    <client-only>
      <cookie-consent />
    </client-only>
    <!-- <app-footer /> -->
  </v-app>
</template>

<script>
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
// import FabScrollTop from '~/components/FabScrollTop.vue'
import CookieConsent from '~/components/CookieConsent.vue'
// import HistoryViewer from '~/components/HistoryViewer.vue'
import AppDrawer from '~/components/AppDrawer.vue'

export default {
  components: {
    AppDrawer,
    CookieConsent,
    AppHeader,
    // eslint-disable-next-line vue/no-unused-components
    AppFooter,
    // FabScrollTop,
    // HistoryViewer,
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
