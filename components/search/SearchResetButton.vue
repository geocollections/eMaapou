<script setup lang="ts">
import { mdiEraser } from "@mdi/js";
</script>

<template>
  <VBtn
    variant="outlined"
    color="grey"
    class="reset-search mr-2 px-3 montserrat rounded text-body-1 text-capitalize"
    :icon="$vuetify.display.md"
    @click="$emit('click')"
  >
    <VTooltip v-if="$vuetify.display.md" position="bottom">
      <template #activator="{ props }">
        <VIcon
          :icon="mdiEraser"
          :end="!$vuetify.display.md"
          v-bind="props"
        />
      </template>

      <span>
        {{ $t("common.resetSearchLong") }}
      </span>
    </VTooltip>
    <VIcon
      v-else
      :icon="mdiEraser"
      start
    />
    <span class="hidden-md montserrat">
      {{ $t("common.resetSearch") }}
    </span>
  </VBtn>
</template>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
