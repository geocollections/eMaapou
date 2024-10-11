<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js";

withDefaults(defineProps<{
  label: string;
  icon?: string;
  labelOnly?: boolean;
  trailingIcon?: string;
}>(), {
  labelOnly: false,
  trailingIcon: mdiArrowRight,
});
</script>

<template>
  <div
    color="accent"
    base-color="grey-darken-4"
    class="rounded"
  >
    <div class="d-flex py-1">
      <div v-if="!labelOnly">
        <div
          v-if="icon"
          start
          :icon="icon"
        />
        <div
          v-else
          style="height: 24px; width: 24px"
          start
        />
      </div>
      <span class="align-self-center montserrat">{{ label }}</span>
      <div
        :icon="mdiArrowRight"
        class="ml-auto"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-list-item::before {
  border-radius: 4px;
}
</style>
