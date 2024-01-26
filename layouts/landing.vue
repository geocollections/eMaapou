<template>
  <v-app dark>
    <app-drawer
      v-if="!$vuetify.display.mdAndUp"
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <app-header
      :drawer="drawer"
      transparent
      :show-search="false"
      :max-width="1185"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <v-main class="pt-0 pb-10" style="min-height: 100vh">
      <slot />
      <fab-scroll-top />
      <client-only>
        <cookie-consent />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(false);
</script>
