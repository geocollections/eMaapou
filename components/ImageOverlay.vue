<script setup lang="ts">
import { mdiFileDownloadOutline, mdiInformationOutline } from "@mdi/js";
import type { ImageModifiers, ImageOptions } from "@nuxt/image";
import type { RouteLocationRaw } from "vue-router";

export interface OverlayImage {
  src: string;
  modifiers: Partial<ImageModifiers>;
  options: ImageOptions;
  id?: number;
}

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
const emit = defineEmits(["input"]);
const img = useImage();
const localePath = useLocalePath();
</script>

<template>
  <VDialog
    :model-value="modelValue"
    overlay-opacity="0.80"
    content-class="elevation-0"
    offset-x
    @update:model-value="emit('input', !modelValue)"
  >
    <div class="text-center" @click="emit('input', !modelValue)">
      <NuxtImg
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
      <VBtn
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
        <VIcon start>
          {{ mdiInformationOutline }}
        </VIcon>
        {{ $t("photo.viewDetail") }}
      </VBtn>
      <div class="bg-white rounded px-2">
        <VIcon start>
          {{ mdiFileDownloadOutline }}
        </VIcon>
        <VBtn
          variant="text"
          class="text-capitalize"
          :href="img(image.src, { size: 'small' }, image.options)"
          target="_blank"
        >
          {{ $t("common.small") }}
        </VBtn>
        <VBtn
          variant="text"
          class="text-capitalize"
          :href="img(image.src, { size: 'medium' }, image.options)"
          target="_blank"
        >
          {{ $t("common.medium") }}
        </VBtn>
        <VBtn
          variant="text"
          class="text-capitalize"
          :href="img(image.src, { size: 'large' }, image.options)"
          target="_blank"
        >
          {{ $t("common.large") }}
        </VBtn>
        <VBtn
          variant="text"
          class="text-capitalize"
          :href="img(image.src, {}, image.options)"
          target="_blank"
        >
          {{ $t("common.original") }}
        </VBtn>
      </div>
    </div>
  </VDialog>
</template>
