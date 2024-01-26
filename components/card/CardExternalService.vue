<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :href="route.href"
      class="d-flex py-2"
      :elevation="hover ? 2 : 1"
      :color="hover ? 'grey-lighten-2' : 'grey-lighten-3'"
    >
      <div>
        <v-card-title
          style="width: 100%"
          class="text-h6"
          :class="{ 'py-0': true }"
        >
          {{ $t(route.title) }}
        </v-card-title>
        <v-card-text class="py-0 montserrat text-grey">
          {{ $t(route.description) }}
        </v-card-text>
      </div>
      <v-icon
        :icon="mdiOpenInNew"
        size="x-small"
        class="ml-auto mr-2 align-self-baseline"
      >
      </v-icon>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";
defineProps({
  route: {
    type: Object,
    required: true,
  },
});
</script>
