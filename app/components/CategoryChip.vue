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
    <div
      class="text-none"
      variant="tonal"
      color="accent"
      label
      :to="to"
    >
      <div start>
        {{ icon }}
      </div>
      {{ title }}
    </div>
    <template #fallback>
      <div
        class="text-none"
        variant="tonal"
        color="accent"
        label
      >
        <div start>
          {{ icon }}
        </div>
        {{ title }}
      </div>
    </template>
  </ClientOnly>
</template>
