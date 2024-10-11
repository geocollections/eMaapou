<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";

interface RouteExternalService {
  title: string;
  description: string;
  href: string;
}

defineProps<{ route: RouteExternalService }>();
</script>

<template>
  <div>
    <div
      :href="route.href"
      class="d-flex py-2 border"
      :elevation="0"
    >
      <div>
        <div
          style="width: 100%"
          class="text-h6 py-0"
        >
          {{ $t(route.title) }}
        </div>
        <div class="py-0  text-grey">
          {{ $t(route.description) }}
        </div>
      </div>
      <div
        :icon="mdiOpenInNew"
        size="x-small"
        class="ml-auto mr-2 align-self-baseline"
      />
    </div>
  </div>
</template>
