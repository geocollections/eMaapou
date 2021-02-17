<template>
  <v-app dark>
    <v-main>
      <app-header />
      <v-container>
        <nuxt />
        <link-to-edit-fab />
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
  components: { LinkToEditFab, AppHeader, AppFooter, ScrollTopFab },
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
