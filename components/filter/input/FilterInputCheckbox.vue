<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <VCheckbox
    class="ml-2"
    hide-details
    color="accent"
    :model-value="modelValue"
    density="compact"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #label>
      <div
        class="font-weight-medium text-body-2 "
      >
        {{ label }}
      </div>
    </template>
  </VCheckbox>
</template>
