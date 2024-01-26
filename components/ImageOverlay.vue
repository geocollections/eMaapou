<template>
  <v-dialog
    :model-value="modelValue"
    overlay-opacity="0.80"
    content-class="elevation-0"
    offset-x
    @input="emit('input', !modelValue)"
  >
    <div class="text-center" @click="emit('input', !modelValue)">
      <nuxt-img
        v-if="image"
        class="rounded"
        style="max-height: 80vh; max-width: 100%; object-fit: contain"
        :src="image.src"
        :modifiers="image.modifiers"
        :provider="image.options.provider"
      />
    </div>
    <div
      v-if="image"
      class="d-flex justify-center"
      style="position: absolute; bottom: 1rem"
    >
      <v-btn
        class="montserrat text-capitalize font-weight-regular mr-2"
        nuxt
        :to="
          localePath({
            name: 'file-id',
            params: { id: image?.id?.toString() ?? '' },
          })
        "
        color="info"
        elevation="2"
      >
        <v-icon left>{{ mdiInformationOutline }}</v-icon>
        {{ $t("photo.viewDetail") }}
      </v-btn>
      <div class="white rounded px-2">
        <v-icon left>{{ mdiFileDownloadOutline }}</v-icon>
        <v-btn
          text
          class="text-capitalize"
          :href="img(image.src, { size: 'small' }, image.options)"
          target="_blank"
        >
          {{ $t("common.small") }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="img(image.src, { size: 'medium' }, image.options)"
          target="_blank"
        >
          {{ $t("common.medium") }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="img(image.src, { size: 'large' }, image.options)"
          target="_blank"
        >
          {{ $t("common.large") }}
        </v-btn>
        <v-btn
          text
          class="text-capitalize"
          :href="img(image.src, {}, image.options)"
          target="_blank"
        >
          {{ $t("common.original") }}
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiInformationOutline, mdiFileDownloadOutline } from "@mdi/js";
import type { ImageModifiers, ImageOptions } from "@nuxt/image";
import type { RouteLocationRaw } from "vue-router";

export type OverlayImage = {
  src: string;
  modifiers: Partial<ImageModifiers>;
  options: ImageOptions;
  id?: number;
};

const emit = defineEmits(["input"]);
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Object as PropType<OverlayImage>,
    default: undefined,
  },
  detailRoute: {
    type: Object as PropType<RouteLocationRaw>,
    default: undefined,
  },
});
const img = useImage();
const localePath = useLocalePath();
</script>
