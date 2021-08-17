<template>
  <v-app dark>
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />
    <navigation-drawer
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <v-main>
      <v-container class="pt-0" :fluid="$vuetify.breakpoint.lgAndDown">
        <client-only>
          <history-viewer v-if="$vuetify.breakpoint.smAndUp" />
        </client-only>
        <nuxt />
        <scroll-top-fab />
      </v-container>
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import ScrollTopFab from '~/components/ScrollTopFab.vue'
import CookiePolicy from '~/components/CookiePolicy'
import HistoryViewer from '~/components/HistoryViewer.vue'
import NavigationDrawer from '~/components/NavigationDrawer'

export default {
  components: {
    NavigationDrawer,
    CookiePolicy,
    AppHeader,
    AppFooter,
    ScrollTopFab,
    HistoryViewer,
  },
  data() {
    return {
      drawer: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.background-image ::v-deep > .v-image__image {
  filter: brightness(0.6) !important;
}

// .v-image ::v-deep .v-image__image {
//   background-position: center 40% !important;
// }
</style>
