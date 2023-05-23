<template>
  <div class="py-2 d-flex justify-center">
    <thumbnail-image
      v-if="isImage && src && previewSrc"
      :src="src"
      :preview-src="previewSrc"
      @click="$emit('click:image')"
    />
    <v-icon
      v-else-if="isImage"
      color="primary darken-2"
      large
      @click="$emit('click')"
    >
      {{ icons.mdiFileImageOutline }}
    </v-icon>
    <v-icon
      v-else-if="isVideo"
      color="primary darken-2"
      large
      @click="$emit('click')"
    >
      {{ icons.mdiFileVideoOutline }}
    </v-icon>
    <v-icon v-else color="primary darken-2" large @click="$emit('click')">
      {{ icons.mdiFileOutline }}
    </v-icon>
  </div>
</template>

<script>
import {
  mdiFileVideoOutline,
  mdiFileOutline,
  mdiFileImageOutline,
} from '@mdi/js'
import ThumbnailImage from './ThumbnailImage.vue'
export default {
  name: 'ThumbnailAttachment',
  components: { ThumbnailImage },
  props: {
    src: {
      type: String,
      default: null,
    },
    previewSrc: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
      required: true,
    },
  },
  computed: {
    icons() {
      return {
        mdiFileVideoOutline,
        mdiFileOutline,
        mdiFileImageOutline,
      }
    },
    isImage() {
      return this.type?.startsWith('image')
    },
    isVideo() {
      return this.type?.startsWith('video')
    },
  },
}
</script>
