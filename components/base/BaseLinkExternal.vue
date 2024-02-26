<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";

defineProps<{
  href?: string | null;
  target?: string;
}>();
</script>

<template>
  <a
    :href="href"
    :target="target"
    class="text-link"
  >
    <slot />
    <span style="white-space: nowrap; display: inline-block">
      <slot name="icon">
        <VIcon class="open-new-icon" size="x-small">{{ mdiOpenInNew }}</VIcon>
      </slot>
    </span>
  </a>
</template>

<style scoped>
.open-new-icon {
  vertical-align: text-top !important;
}

.open-new-icon:hover {
  text-decoration: none !important;
}
</style>
