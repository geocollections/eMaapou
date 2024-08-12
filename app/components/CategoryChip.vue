<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  title: string;
  to?: RouteLocationRaw;
  icon?: string;
}>();
</script>

<template>
  <ClientOnly>
    <VChip
      class="text-none"
      variant="tonal"
      color="accent"
      label
      :to="to"
    >
      <VIcon start>
        {{ icon }}
      </VIcon>
      {{ title }}
    </VChip>
    <template #fallback>
      <VChip
        class="text-none"
        variant="tonal"
        color="accent"
        label
      >
        <VIcon start>
          {{ icon }}
        </VIcon>
        {{ title }}
      </VChip>
    </template>
  </ClientOnly>
</template>
