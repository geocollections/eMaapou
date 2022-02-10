<template>
  <v-app dark>
    <the-landing-header
      :drawer="drawer"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <v-main class="pt-0">
      <nuxt />
      <fab-scroll-top />
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '~/components/AppFooter'
import CookiePolicy from '~/components/CookiePolicy.vue'
import TheLandingHeader from '~/components/landing/TheLandingHeader.vue'
import AppDrawer from '~/components/AppDrawer.vue'
import FabScrollTop from '~/components/FabScrollTop.vue'
export default {
  components: {
    AppDrawer,
    TheLandingHeader,
    FabScrollTop,
    CookiePolicy,
    AppFooter,
  },
  data() {
    return {
      drawer: false,
    }
  },
}
</script>
