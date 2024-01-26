<template>
  <v-btn
    variant="outlined"
    color="grey"
    class="reset-search mr-2 px-3 montserrat rounded text-body-1 text-capitalize"
    :icon="$vuetify.display.md"
    @click="$emit('click')"
  >
    <v-tooltip v-if="$vuetify.display.md" position="bottom">
      <template #activator="{ props }">
        <v-icon :icon="mdiEraser" :end="!$vuetify.display.md" v-bind="props" />
      </template>

      <span>
        {{ $t("common.resetSearchLong") }}
      </span>
    </v-tooltip>
    <v-icon v-else :icon="mdiEraser" start />
    <span class="hidden-md-only montserrat">
      {{ $t("common.resetSearch") }}
    </span>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiEraser } from "@mdi/js";
</script>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
