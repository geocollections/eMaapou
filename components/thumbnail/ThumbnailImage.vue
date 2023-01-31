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
      <v-img
        content-class="rounded"
        :max-height="600"
        :contain="true"
        :src="src"
      />
    </v-dialog>
  </div>
</template>

<script>
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
