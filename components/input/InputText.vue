<script>
export default {
  name: "InputText",
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
};
</script>

<template>
  <VTextField
    class="pt-4"
    :label="label"
    hide-details
    :model-value="value"
    type="text"
    @update:model-value="$emit('input', $event)"
    @change="$emit('change', $event)"
  />
</template>
