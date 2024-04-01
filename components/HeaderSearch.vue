<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps<{
  title: string;
  icon: string;
  count: number;
}>();

const display = useDisplay();
</script>

<template>
  <div class="my-4 my-md-6 mx-2 mx-md-4">
    <div
      style="word-break: normal"
      class="d-flex align-center text-md-h3 text-h4"
    >
      <VIcon
        v-if="icon"
        start
        color="accent"
      >
        {{ icon }}
      </VIcon>
      <span
        class="montserrat font-weight-medium"
      >
        <slot name="title">
          {{ title }}
        </slot>
        <div class="mt-1 text-h6 text-md-h5">
          {{ $t("common.count", { count }) }}
        </div>
      </span>
    </div>
  </div>
</template>
