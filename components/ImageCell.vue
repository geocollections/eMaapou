<template>
  <v-img
    v-ripple="{ class: 'deep-orange--text darken-2' }"
    class="image-cell rounded"
    max-height="80px"
    width="90px"
    aspect-ratio="1"
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

<style lang="scss" scoped>
.image-cell {
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
}
</style>
