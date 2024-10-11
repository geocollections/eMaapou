<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js";

interface RouteItem {
  routeName: string;
  text: string;
  icon: string;
  count: number;
}

defineProps<{ route: RouteItem }>();

const localePath = useLocalePath();
</script>

<template>
  <div>
    <div
      :to="localePath(route.routeName)"
      class="mx-sm-1 mb-1 mb-sm-2 d-flex border"
      :elevation="0"
    >
      <div class="py-2 d-flex d-sm-block align-center">
        <VIcon
          :icon="route.icon"
          color="accent-lighten-3"
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
          }"
        >
          <div class="montserrat">
            {{ $t(route.text) }}
          </div>
        </div>
      </div>
      <VIcon
        :icon="mdiArrowRight"
        color="accent-lighten-3"
        class="ml-auto my-auto"
        start
      />
    </div>
  </div>
</template>
