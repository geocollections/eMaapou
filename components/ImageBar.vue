<script setup lang="ts" generic="T">
import type { OverlayImage } from "./ImageOverlay.vue";

export interface Image<T> {
  id: number;
  filename: string;
  info: T;
}

defineProps({
  images: {
    type: Array as PropType<Image<T>[]>,
    required: true,
  },
  total: {
    type: Number,
    required: true,
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
const initIndex = ref(0);
function openOverlay(index: number, image: OverlayImage) {
  overlayImage.value = image;
  initIndex.value = index;
  showOverlay.value = true;
}

function handleEnd() {
  loadMore();
}
</script>

<template>
  <div class="d-flex align-center bg-grey-lighten-4 pa-2 rounded border" style="overflow-x: auto">
    <div
      v-for="(item, index) in images"
      :key="index"
      class="mr-3 "
    >
      <VTooltip location="bottom" color="accent">
        <template #activator="{ props: tooltipProps }">
          <slot name="image" :item="item">
            <NuxtImg
              v-bind="tooltipProps"
              :src="item.filename"
              provider="geocollections"
              :modifiers="{ size: 'medium' }"
              height="175"
              class="rounded cursor-pointer thumbnail-image"
              @click="
                openOverlay(index, {
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
            </NuxtImg>
          </slot>
        </template>
        <slot name="tooltipInfo" :item="item">
          <div>
            {{ $t("common.clickToOpen") }}
          </div>
        </slot>
      </VTooltip>
    </div>
    <div v-intersect="loadMore" />
    <ImageOverlay
      v-model="showOverlay"
      :initial-slide="initIndex"
      :images="images"
      :total="total"
      @end="handleEnd"
    >
      <template #overlayInfo="{ item }">
        <slot name="overlayInfo" :item="item" />
      </template>
    </ImageOverlay>
  </div>
</template>

<style lang="scss" scoped>
.thumbnail-image {
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid #1565C0;
  }
}
</style>
