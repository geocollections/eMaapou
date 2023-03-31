<template>
  <v-dialog
    :value="value"
    overlay-opacity="0.80"
    content-class="elevation-0"
    offset-x
    @input="$emit('input', !value)"
  >
    <div class="text-center" @click="$emit('input', !value)">
      <nuxt-img
        v-if="image"
        class="rounded"
        style="max-height: 80vh; max-width: 100%; object-fit: contain"
        :src="image.src"
        :modifiers="image.modifiers"
        :provider="image.options.provider"
      />
    </div>
    <div v-if="image" class="d-flex" style="position: absolute; bottom: 1rem">
      <v-btn
        class="montserrat text-capitalize font-weight-regular mr-2"
        nuxt
        :to="
          localePath({
            name: 'photo-id',
            params: { id: image?.id?.toString() ?? '' },
          })
        "
        color="info"
        elevation="2"
      >
        <v-icon left>{{ icons.mdiInformationOutline }}</v-icon>
        {{ $t('photo.viewDetail') }}
      </v-btn>
      <div class="white rounded px-2">
        <v-icon left>{{ icons.mdiFileDownloadOutline }}</v-icon>
        <v-btn
          text
          class="text-capitalize"
          :href="$img(image.src, { size: 'small' }, image.options)"
          target="_blank"
        >
          {{ $t('common.small') }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="$img(image.src, { size: 'medium' }, image.options)"
          target="_blank"
        >
          {{ $t('common.medium') }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="$img(image.src, { size: 'large' }, image.options)"
          target="_blank"
        >
          {{ $t('common.large') }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="$img(image.src, {}, image.options)"
          target="_blank"
        >
          {{ $t('common.original') }}
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import { Route } from 'vue-router'
import { mdiInformationOutline, mdiFileDownloadOutline } from '@mdi/js'
import { ImageModifiers, ImageOptions } from '@nuxt/image'

export type OverlayImage = {
  src: string
  modifiers: Partial<ImageModifiers>
  options: ImageOptions
  id?: number
}

export default defineComponent({
  name: 'ImageOverlay',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    image: {
      type: Object as PropType<OverlayImage>,
      default: undefined,
    },
    detailRoute: {
      type: Object as PropType<Route>,
      default: undefined,
    },
  },
  setup() {
    const icons = computed(() => ({
      mdiInformationOutline,
      mdiFileDownloadOutline,
    }))
    return { icons }
  },
})
</script>
