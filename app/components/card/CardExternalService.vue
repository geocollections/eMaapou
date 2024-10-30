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
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <NuxtLink
        v-bind="hoverProps"
        :to="route.href"
        class="d-flex py-2 pl-4 border rounded text-decoration-none"
        :class="isHovering ? 'bg-grey-lighten-2' : 'bg-grey-lighten-3'"
      >
        <div>
          <div
            style="width: 100%"
            class="text-h6 py-0"
          >
            {{ $t(route.title) }}
          </div>
          <div class="py-0 text-grey-darken-2 text-body-2">
            {{ $t(route.description) }}
          </div>
        </div>
        <VIcon
          :icon="mdiOpenInNew"
          size="x-small"
          class="ml-auto mr-2 align-self-baseline"
        />
      </NuxtLink>
    </VHover>
  </div>
</template>
