<template>
  <v-checkbox
    :label="label"
    hide-details
    :input-value="value"
    false-value="null"
    @change="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'InputCheckbox',
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
}
</script>
