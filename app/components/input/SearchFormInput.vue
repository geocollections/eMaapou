<script setup lang="ts">
import { mdiClose } from "@mdi/js";

defineProps<{ modelValue: string }>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <VTextField
    :model-value="modelValue"
    variant="outlined"
    bg-color="white"
    density="comfortable"
    flat
    class="rounded mx-2"
    hide-details
    :placeholder="$t('common.searchAlt')"
    clearable
    :clear-icon="mdiClose"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
