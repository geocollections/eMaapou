<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";

defineProps({
  route: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <VHover v-slot="{ hover }">
    <VCard
      :href="route.href"
      class="d-flex py-2"
      :elevation="hover ? 2 : 1"
      :color="hover ? 'grey-lighten-2' : 'grey-lighten-3'"
    >
      <div>
        <VCardTitle
          style="width: 100%"
          class="text-h6 py-0"
        >
          {{ $t(route.title) }}
        </VCardTitle>
        <VCardText class="py-0 montserrat text-grey">
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
</template>
