<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

const drawer = ref(false);

const { mdAndUp } = useDisplay();
watchEffect(() => {
  if (mdAndUp)
    drawer.value = false;
});
</script>

<template>
  <VApp>
    <AppHeader :drawer="drawer" @toggle:navigation-drawer="drawer = !drawer" />
    <AppDrawer
      v-if="!mdAndUp"
      :drawer="drawer"
      @update:navigation-drawer="drawer = $event"
    />
    <slot />
    <ClientOnly>
      <CookieConsent />
    </ClientOnly>
  </VApp>
</template>
