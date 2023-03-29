<template>
  <div>
    <v-dialog
      v-model="open"
      overlay-opacity="0.80"
      content-class="elevation-0"
      offset-x
    >
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
        <v-img content-class="rounded" contain max-height="80vh" :src="src" />
        <v-btn
          v-if="detailRoute"
          class="montserrat text-capitalize font-weight-regular"
          absolute
          style="bottom: 1rem"
          nuxt
          :to="detailRoute"
          color="info"
          elevation="2"
        >
          <v-icon left>{{ icons.mdiInformationOutline }}</v-icon>
          {{ $t('photo.viewDetail') }}
        </v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
// TODO: "Currently a dialog is created for every thumbnail image.
// would be better if there was only one dialog that we pass the image url to.
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import { Route } from 'vue-router'

import { mdiInformationOutline } from '@mdi/js'
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
    detailRoute: {
      type: Object as PropType<Route | null>,
      default: null,
    },
  },
  setup() {
    const open = ref(false)
    const icons = computed(() => ({
      mdiInformationOutline,
    }))
    return { open, icons }
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
