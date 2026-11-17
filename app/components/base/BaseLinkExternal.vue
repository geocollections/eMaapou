<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  href?: RouteLocationRaw;
  to?: RouteLocationRaw;
  target?: string;
}>();
defineSlots<{ default: () => any; icon?: () => any }>();
</script>

<template>
  <ULink
    :to="props.to ?? props.href"
    :target="target"
    class="portal-record-link"
  >
    <slot /><span class="portal-link-icon"><slot name="icon"><UIcon name="i-lucide-arrow-up-right" /></slot></span>
  </ULink>
</template>
