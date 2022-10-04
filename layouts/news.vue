<template>
  <v-app dark>
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />

    <v-main style="min-height: 100vh">
      <v-container class="pb-10">
        <nuxt />
        <fab-scroll-top />
      </v-container>
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
export default {
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
