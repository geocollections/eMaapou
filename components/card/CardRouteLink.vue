<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js";

defineProps({
  route: {
    type: Object,
    required: true,
  },
});
const localePath = useLocalePath();
</script>

<template>
  <v-hover v-slot="{ hover }">
    <v-card
      nuxt
      :to="localePath(route.routeName)"
      class="mx-sm-1 mb-1 mb-sm-2 d-flex"
      :elevation="hover ? 2 : 1"
      :color="hover ? 'accent lighten-1' : 'accent'"
    >
      <div class="py-2 d-flex d-sm-block align-center">
        <v-icon
          v-if="$vuetify.display.smAndUp"
          :icon="route.icon"
          color="accent-lighten-2"
          end
        />
        <div
          class="text-h5 text-sm-h4 pl-2 pl-sm-3 pt-sm-2 font-weight-bold text-white"
        >
          {{
            Math.max(
              Math.floor(route.count / 1000) * 1000,
              Math.floor(route.count / 100) * 100,
            )
              .toLocaleString()
              .replace(/,/g, "\u00A0")
          }}+
        </div>
        <div
          class="font-weight-regular text-h6 pl-3 pt-0 text-white"
          :class="{
            'text-body-1': $vuetify.display.smAndDown,
          }"
        >
          <div class="montserrat">
            {{ $t(route.text) }}
          </div>
        </div>
      </div>
      <v-icon
        :icon="mdiArrowRight"
        color="accent-lighten-2"
        class="ml-auto my-auto"
        start
      />
    </v-card>
  </v-hover>
</template>
