<template>
  <v-app dark>
    <v-main>
      <app-header />
      <v-container :fluid="$vuetify.breakpoint.lgAndDown">
        <nuxt />
        <link-to-edit-fab v-if="isDetail" />
        <scroll-top-fab class="fab-container ma-3" />
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'
import LinkToEditFab from '@/components/LinkToEditFab'
import ScrollTopFab from '~/components/ScrollTopFab.vue'

export default {
  components: { AppHeader, AppFooter, ScrollTopFab, LinkToEditFab },
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
  bottom: 0;
  right: 0;
}
</style>
