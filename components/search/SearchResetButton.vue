<script setup lang="ts">
import { mdiEraser } from "@mdi/js";

const emit = defineEmits(["click"]);
</script>

<template>
  <VBtn
    variant="text"
    color="grey-darken-1"
    class="reset-search mr-2 montserrat rounded text-capitalize"
    @click="emit('click')"
  >
    <VIcon
      :icon="mdiEraser"
      start
    />
    <span class="montserrat">
      {{ $t("common.resetSearch") }}
    </span>
  </VBtn>
</template>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
