<script setup lang="ts">
import { mdiArrowTopRight } from "@mdi/js";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  href?: RouteLocationRaw;
  target?: string;
}>();
</script>

<template>
  <NuxtLink
    :href="href"
    :target="target"
    class="text-link"
  >
    <slot />
    <span style="white-space: nowrap; display: inline-block">
      <slot name="icon">
        <VIcon class="open-new-icon" size="x-small">{{ mdiArrowTopRight }}</VIcon>
      </slot>
    </span>
  </NuxtLink>
</template>

<style scoped>
.open-new-icon {
  vertical-align: text-top !important;
}

.open-new-icon:hover {
  text-decoration: none !important;
}
</style>
