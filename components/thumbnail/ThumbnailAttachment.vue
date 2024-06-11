<script setup lang="ts">
import {
  mdiFileImageOutline,
  mdiFileOutline,
  mdiFileVideoOutline,
} from "@mdi/js";

const props = defineProps({
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
});

const emit = defineEmits(["click", "click:image"]);

const isImage = computed(() => props.type?.startsWith("image"));
const isVideo = computed(() => props.type?.startsWith("video"));
</script>

<template>
  <div class="py-2 d-flex justify-center">
    <ThumbnailImage
      v-if="isImage && src && previewSrc"
      :src="src"
      :preview-src="previewSrc"
      @click="emit('click:image')"
    />
    <VIcon
      v-else-if="isImage"
      color="primary-darken-2"
      size="large"
      @click="emit('click')"
    >
      {{ mdiFileImageOutline }}
    </VIcon>
    <VIcon
      v-else-if="isVideo"
      color="primary-darken-2"
      size="large"
      @click="emit('click')"
    >
      {{ mdiFileVideoOutline }}
    </VIcon>
    <VIcon
      v-else
      color="primary-darken-2"
      size="large"
      @click="emit('click')"
    >
      {{ mdiFileOutline }}
    </VIcon>
  </div>
</template>
