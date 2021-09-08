<template>
  <v-app dark>
    <navigation-drawer
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />

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
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
import ScrollTopFab from '~/components/ScrollTopFab.vue'
import CookiePolicy from '~/components/CookiePolicy.vue'
import HistoryViewer from '~/components/HistoryViewer.vue'
import NavigationDrawer from '~/components/NavigationDrawer.vue'

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
