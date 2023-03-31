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

<script lang="ts">
// TODO: "Currently a dialog is created for every thumbnail image.
// would be better if there was only one dialog that we pass the image url to.
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ThumbnailImage',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    const open = ref(false)
    return { open }
  },
})
</script>

<style lang="scss" scoped>
.thumbnail-image {
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
}
</style>
