<script setup lang="ts">
// TODO: "Currently a dialog is created for every thumbnail image.
// would be better if there was only one dialog that we pass the image url to.

defineProps<{
  src: string;
}>();
</script>

<template>
  <v-img
    id="preview-img"
    v-ripple="{ class: 'primary--text darken-2' }"
    class="thumbnail-image rounded"
    max-height="80px"
    width="80px"
    aspect-ratio="1"
    :src="src"
    @click="$emit('click')"
  />
</template>

<style lang="scss" scoped>
.thumbnail-image {
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
}
</style>
