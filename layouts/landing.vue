<template>
  <v-app dark>
    <app-drawer :drawer="drawer" @update:navigationDrawer="drawer = $event" />
    <app-header
      :drawer="drawer"
      transparent
      :show-search="false"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <v-main class="pt-0" style="min-height: 100vh">
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
export default {
  data() {
    return {
      drawer: false,
    }
  },
}
</script>
