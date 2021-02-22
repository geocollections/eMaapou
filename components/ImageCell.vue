<template>
  <v-img
    height="100px"
    width="100px"
    contain
    :src="src"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'ImageCell',
  props: {
    src: {
      type: String,
      default: null,
      required: true,
    },
  },
}
</script>
