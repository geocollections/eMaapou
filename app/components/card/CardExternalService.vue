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
      <VCard
        v-bind="hoverProps"
        :href="route.href"
        class="d-flex py-2 border"
        :elevation="0"
        :color="isHovering ? 'grey-lighten-2' : 'grey-lighten-3'"
      >
        <div>
          <VCardTitle
            style="width: 100%"
            class="text-h6 py-0"
          >
            {{ $t(route.title) }}
          </VCardTitle>
          <VCardText class="py-0  text-grey">
            {{ $t(route.description) }}
          </VCardText>
        </div>
        <VIcon
          :icon="mdiOpenInNew"
          size="x-small"
          class="ml-auto mr-2 align-self-baseline"
        />
      </VCard>
    </VHover>
  </div>
</template>
