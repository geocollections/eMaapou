<template>
  <div>
    <v-dialog v-model="open" content-class="elevation-0" offset-x>
      <template #activator="{ on, attrs }">
        <v-img
          id="preview-img"
          v-ripple="{ class: 'primary--text darken-2' }"
          class="thumbnail-image rounded"
          max-height="80px"
          width="80px"
          aspect-ratio="1"
          :src="previewSrc"
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <div @click="open = !open">
        <v-img content-class="rounded" contain :max-height="700" :src="src" />
      </div>
    </v-dialog>
  </div>
</template>

<script>
// TODO: Currently a dialog is created for every thumbnail image.
// would be better if there was only one dialog that we pass the image url to.
import { defineComponent, ref } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'ThumbnailImage',
  props: {
    previewSrc: {
      type: String,
      required: true,
    },
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
