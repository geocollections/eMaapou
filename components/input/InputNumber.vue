<script>
export default {
  name: "InputNumber",
  props: {
    value: { type: Number, required: true },
    label: { type: String, default: "" },
  },
};
</script>

<template>
  <VTextField
    class="pt-4"
    :label="label"
    hide-details
    v-bind="$attrs"
    type="number"
    :model-value="value"
    @update:model-value="$emit('input', $event)"
  />
</template>
