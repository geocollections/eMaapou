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
    <ImageOverlayNew
      v-model="showOverlay"
      :initial-slide="initIndex"
      :images="images"
      :total="total"
      @end="handleEnd"
    />
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
