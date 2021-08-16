<template>
  <div>
    <v-icon v-if="value" color="green" small>mdi-check-bold</v-icon>
    <v-icon v-else color="red" small>mdi-close-thick</v-icon>
  </div>
</template>

<script>
export default {
  name: 'BooleanIndicator',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
