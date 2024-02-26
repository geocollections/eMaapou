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
        class="font-weight-medium text-body-1"
        style="
          color: rgba(0, 0, 0, 0.87) !important;
          font-size: 0.9375rem !important;
        "
      >
        {{ label }}
      </div>
    </template>
  </VCheckbox>
</template>
