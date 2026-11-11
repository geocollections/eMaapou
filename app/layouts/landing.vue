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
      <AppBar />
      <VMain class="pb-10" style="min-height: 100vh">
        <div>
          <slot />
        </div>
      </VMain>

      <AppFooter />
    </VApp>
  </div>
</template>
