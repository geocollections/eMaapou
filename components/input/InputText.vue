<template>
  <v-text-field
    class="pt-4"
    :label="label"
    hide-details
    :value="value"
    type="text"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  />
</template>

<script>
export default {
  name: 'InputText',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
}
</script>
