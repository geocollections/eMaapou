<script>
export default {
  name: "InputCheckbox",
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: "" },
  },
};
</script>

<template>
  <div style="flex: 1 0 100%; max-width: 100%; position: relative">
    <VCheckbox
      hide-details
      color="accent"
      :model-value="value"
      dense
      false-value="null"
      @update:model-value="$emit('input', $event)"
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
  </div>
</template>
