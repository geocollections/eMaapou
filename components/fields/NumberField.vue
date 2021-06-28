<template>
  <v-text-field
    class="pt-4 montserrat"
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
  name: 'NumberField',
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, default: '' },
  },
}
</script>
