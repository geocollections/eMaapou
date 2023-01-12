<template>
  <v-text-field
    class="pt-4"
    :label="label"
    hide-details
    v-bind="$attrs"
    type="number"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    value: { type: Number, required: true },
    label: { type: String, default: '' },
  },
}
</script>
