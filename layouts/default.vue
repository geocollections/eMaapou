<template>
  <v-app dark>
    <v-main>
      <app-header />
      <v-container :fluid="$vuetify.breakpoint.lgAndDown">
        <nuxt />
        <back-fab v-if="isDetail" />
        <link-to-edit-fab v-if="isDetail" />
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
import BackFab from '~/components/BackFab.vue'

export default {
  components: {
    CookiePolicy,
    AppHeader,
    AppFooter,
    ScrollTopFab,
    LinkToEditFab,
    BackFab,
  },
  data() {
    return {
      includeList: ['AnalysisSearch'],
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
      ]
      return detailViewRouteNames.some((route) =>
        this.getRouteBaseName().startsWith(route)
      )
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
