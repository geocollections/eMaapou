<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import { mdiArrowTopRight } from "@mdi/js";

defineProps<{
  href?: RouteLocationRaw;
  target?: string;
}>();
</script>

<template>
  <NuxtLink
    :to="href"
    :target="target"
    class="text-link"
  >
    <slot />
    <span style="white-space: nowrap; display: inline-block">
      <slot name="icon">
        <div class="open-new-icon" size="x-small">{{ mdiArrowTopRight }}</div>
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
