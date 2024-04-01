<script setup lang="ts">
import { mdiClose } from "@mdi/js";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);
</script>

<template>
  <VTextField
    :model-value="modelValue"
    base-color="accent"
    variant="solo"
    density="comfortable"
    bg-color="grey-lighten-5"
    flat
    class="border rounded mx-2"
    hide-details
    :placeholder="$t('common.searchAlt')"
    clearable
    :clear-icon="mdiClose"
    @update:model-value="emit('update:model-value', $event)"
  />
</template>
