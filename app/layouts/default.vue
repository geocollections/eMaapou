<script setup lang="ts">

</script>

<template>
  <V-App class="flex min-h-dvh flex-col">
    <AppBar />

    <main class="flex-1 m-16">
      <slot />
    </main>

    <AppFooter />
  </V-App>
</template>
