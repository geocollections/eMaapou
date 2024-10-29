<script setup lang="ts">
const drawer = ref(false);
</script>

<template>
  <div>
    <VApp dark>
      <AppDrawer
        v-if="!$vuetify.display.mdAndUp"
        :drawer="drawer"
        @update:navigation-drawer="drawer = $event"
      />
      <AppBarLanding
        :drawer="drawer"
        transparent
        :show-search="false"
        :max-width="1185"
        @toggle:navigation-drawer="drawer = !drawer"
      />
      <VMain class="pt-0 pb-10" style="min-height: 100vh">
        <div>
          <slot />
        </div>
      </VMain>

      <AppFooter />
    </VApp>
  </div>
</template>
