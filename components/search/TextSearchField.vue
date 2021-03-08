<template>
  <v-text-field
    :label="label"
    hide-details
    :value="value"
    type="text"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'TextSearchField',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
}
</script>
