<template>
  <v-text-field
    class="pt-4 montserrat"
    :label="label"
    hide-details
    :value="value"
    type="text"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'TextField',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
}
</script>
