<script setup lang="ts">
const drawer = ref(false);
</script>

<template>
  <v-app dark>
    <app-drawer
      v-if="!$vuetify.display.mdAndUp"
      :drawer="drawer"
      @update:navigation-drawer="drawer = $event"
    />
    <app-header
      :drawer="drawer"
      transparent
      :show-search="false"
      :max-width="1185"
      @toggle:navigation-drawer="drawer = !drawer"
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
