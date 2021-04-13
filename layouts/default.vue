<template>
  <v-app dark>
    <v-main>
      <app-header
        :is-detail="isDetail"
        :drawer="drawer"
        @toggle:navigationDrawer="drawer = !drawer"
      />
      <navigation-drawer
        :drawer="drawer"
        @update:navigationDrawer="drawer = $event"
      />
      <v-container :fluid="$vuetify.breakpoint.lgAndDown">
        <link-to-edit-fab v-if="isDetail" />
        <client-only>
          <history-viewer
            v-if="$vuetify.breakpoint.smAndUp && !isFrontPage"
            class="mr-16"
          />
        </client-only>
        <nuxt />
        <scroll-top-fab class="fab-container fab-bottom-right ma-3" />
      </v-container>
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'
import LinkToEditFab from '@/components/LinkToEditFab'
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
    LinkToEditFab,
    HistoryViewer,
  },
  data() {
    return {
      includeList: ['AnalysisSearch'],
      drawer: false,
    }
  },
  computed: {
    isDetail() {
      const detailViewRouteNames = [
        'drillcore-id',
        'analysis-id',
        'area-id',
        'drillcore_box-id',
        'locality-id',
        'sample-id',
        'site-id',
        'file-id',
        'stratigraphy-id',
      ]
      return detailViewRouteNames.some((route) =>
        this.getRouteBaseName().startsWith(route)
      )
    },

    isFrontPage() {
      return this.getRouteBaseName() === 'index'
    },
  },
}
</script>

<style lang="scss" scoped>
.fab-container {
  z-index: 1500;
  position: fixed;
}

.fab-bottom-right {
  bottom: 0;
  right: 0;
}
</style>
