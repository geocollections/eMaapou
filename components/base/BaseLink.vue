<script setup lang="ts">
import type { NuxtLinkProps } from "#app";

const props = defineProps< NuxtLinkProps>();
</script>

<template>
  <NuxtLink v-bind="props" class="text-link">
    <slot />
  </NuxtLink>
</template>
