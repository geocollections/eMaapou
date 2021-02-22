<template>
  <div class="py-2 d-flex justify-center">
    <v-img
      v-if="isImage && src"
      height="100px"
      width="100px"
      contain
      :src="src"
      @click="$emit('click')"
    />
    <v-icon
      v-else-if="isImage"
      color="deep-orange darken-2"
      large
      @click="$emit('click')"
    >
      mdi-file-image-outline
    </v-icon>
    <v-icon
      v-else-if="isVideo"
      color="deep-orange darken-2"
      large
      @click="$emit('click')"
    >
      mdi-file-video-outline
    </v-icon>
    <v-icon v-else color="deep-orange darken-2" large @click="$emit('click')">
      mdi-file-outline
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'AttachmentCell',
  props: {
    src: {
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
    isImage() {
      return this.type?.startsWith('image')
    },
    isVideo() {
      return this.type?.startsWith('video')
    },
  },
}
</script>
