<template>
  <v-icon :color="value ? 'green' : 'red'" small>
    {{ value ? 'mdi-check-bold' : 'mdi-close-thick' }}
  </v-icon>
</template>

<script>
export default {
  name: 'BaseBoolean',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
