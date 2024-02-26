<script setup lang="ts">
import type { OverlayImage } from "./ImageOverlay.vue";

interface Image {
  id: number;
  filename: string;
  author?: string;
  date?: string;
  dateText?: string;
}

defineProps({
  images: {
    type: Array as PropType<Image[]>,
    default: () => [],
  },
});
const emit = defineEmits(["update"]);
const img = useImage();
const rowsPerPage = 10;
const page = ref(1);
const showOverlay = ref(false);
const overlayImage = ref<OverlayImage>();
function loadMore() {
  emit("update", { page: page.value, rows: rowsPerPage });
  page.value += 1;
}
function openOverlay(image: OverlayImage) {
  overlayImage.value = image;
  showOverlay.value = true;
}
</script>

<template>
  <div class="d-flex align-center pb-0" style="overflow-x: auto">
    <div
      v-for="(item, index) in images"
      :key="index"
      class="mr-3 mb-1"
    >
      <VTooltip location="bottom" color="accent">
        <template #activator="{ props }">
          <slot name="image" :item="item">
            <VHover v-slot="{ hover }">
              <VImg
                v-bind="props"
                :src="
                  img(
                    `${item.filename}`,
                    { size: 'medium' },
                    { provider: 'geocollections' },
                  )
                "
                min-width="250"
                aspect-ratio="1.4"
                :class="{
                  'elevation-2': hover,
                }"
                class="lighten-2 rounded transition-swing cursor-pointer"
                @click="
                  openOverlay({
                    src: item.filename,
                    modifiers: { size: 'large' },
                    options: { provider: 'geocollections' },
                    id: item.id,
                  })
                "
              >
                <template #placeholder>
                  <VRow
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <VProgressCircular indeterminate color="grey-lighten-5" />
                  </VRow>
                </template>
              </VImg>
            </VHover>
          </slot>
        </template>
        <slot name="info" :item="item">
          <div v-if="item.author || item.date || item.dateText">
            <div v-if="item.author">
              <span class="font-weight-bold">{{ $t("locality.author") }}:
              </span>
              <span>{{ item.author }}</span>
            </div>
            <div v-if="item.date || item.dateText">
              <span class="font-weight-bold">{{ $t("locality.date") }}: </span>
              <span v-if="item.date">
                {{ $formatDate(item.date) }}
              </span>
              <span v-else>{{ item.dateText }}</span>
            </div>
          </div>
          <div v-else>
            {{ $t("common.clickToOpen") }}
          </div>
        </slot>
      </VTooltip>
    </div>
    <div v-intersect="loadMore" />
    <ImageOverlay v-model="showOverlay" :image="overlayImage" />
  </div>
</template>
