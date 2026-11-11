<script setup lang="ts">

</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppBar />

    <main class="flex-1 my-16 mx-16">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
