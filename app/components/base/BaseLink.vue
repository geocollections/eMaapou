<script setup lang="ts">
defineSlots<{ default: () => any }>();
</script>

<template>
  <ULink class="portal-record-link">
    <slot />
  </ULink>
</template>
