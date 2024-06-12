<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <VCheckbox
    class="ml-2"
    hide-details
    color="blue-darken-2"
    :model-value="modelValue"
    density="compact"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event as boolean)"
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
