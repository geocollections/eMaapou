<template>
  <v-app dark>
    <the-landing-header
      :drawer="drawer"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <navigation-drawer
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <v-main class="pt-0">
      <nuxt />
      <scroll-top-fab />
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>
  </v-app>
</template>

<script>
import CookiePolicy from '~/components/CookiePolicy.vue'
import TheLandingHeader from '~/components/landing/TheLandingHeader.vue'
import NavigationDrawer from '~/components/NavigationDrawer.vue'
import ScrollTopFab from '~/components/ScrollTopFab.vue'
export default {
  components: {
    NavigationDrawer,
    TheLandingHeader,
    ScrollTopFab,
    CookiePolicy,
  },
  data() {
    return {
      drawer: false,
    }
  },
}
</script>
