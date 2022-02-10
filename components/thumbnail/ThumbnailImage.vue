<template>
  <v-img
    v-ripple="{ class: 'primary--text darken-2' }"
    class="thumbnail-image rounded"
    max-height="80px"
    width="90px"
    aspect-ratio="1"
    :src="src"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'ThumbnailImage',
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
.thumbnail-image {
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
}
</style>
