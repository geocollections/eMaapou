<template>
  <v-app>
    <app-header :drawer="drawer" @toggle:navigationDrawer="drawer = !drawer" />
    <app-drawer
      v-if="!mdAndUp"
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />
    <slot />
    <client-only>
      <cookie-consent />
    </client-only>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

const drawer = ref(false);

const { mdAndUp } = useDisplay();
watchEffect(() => {
  if (mdAndUp) {
    drawer.value = false;
  }
});
</script>
