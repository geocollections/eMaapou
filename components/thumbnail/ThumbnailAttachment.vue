<script>
import {
  mdiFileImageOutline,
  mdiFileOutline,
  mdiFileVideoOutline,
} from "@mdi/js";
import ThumbnailImage from "./ThumbnailImage.vue";

export default {
  name: "ThumbnailAttachment",
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
      };
    },
    isImage() {
      return this.type?.startsWith("image");
    },
    isVideo() {
      return this.type?.startsWith("video");
    },
  },
};
</script>

<template>
  <div class="py-2 d-flex justify-center">
    <ThumbnailImage
      v-if="isImage && src && previewSrc"
      :src="src"
      :preview-src="previewSrc"
      @click="$emit('click:image')"
    />
    <VIcon
      v-else-if="isImage"
      color="primary-darken-2"
      size="large"
      @click="$emit('click')"
    >
      {{ icons.mdiFileImageOutline }}
    </VIcon>
    <VIcon
      v-else-if="isVideo"
      color="primary-darken-2"
      size="large"
      @click="$emit('click')"
    >
      {{ icons.mdiFileVideoOutline }}
    </VIcon>
    <VIcon
      v-else
      color="primary-darken-2"
      size="large"
      @click="$emit('click')"
    >
      {{ icons.mdiFileOutline }}
    </VIcon>
  </div>
</template>
