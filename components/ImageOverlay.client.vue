<script setup lang="ts" generic="T">
import { mdiClose } from "@mdi/js";
import type { Image } from "./ImageBar.vue";

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  images: {
    required: true,
    type: Array as PropType<Image<T>[]>,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:model-value", "end"]);

function handleReachEnd() {
  emit("end");
}

const swiper = ref();

function reset() {
  swiper.value.reset();
}

defineExpose({
  reset,
});
</script>

<template>
  <VOverlay
    :model-value="modelValue"
    eager
    content-class="w-100 h-100"
    opacity="0.85"
    @update:model-value="emit('update:model-value', !modelValue)"
  >
    <VBtn
      position="absolute"
      location="top right"
      style="z-index: 10;"
      color="white"
      variant="plain"
      :rounded="0"
      icon
      @click="emit('update:model-value', !modelValue)"
    >
      <VIcon>{{ mdiClose }}</VIcon>
    </VBtn>
    <SwiperLightbox
      ref="swiper"
      :images="images"
      :total="total"
      :initial-slide="initialSlide"
      @end="handleReachEnd"
      @close="emit('update:model-value', !modelValue)"
    >
      <template #info="{ item }">
        <slot name="overlayInfo" :item="item" />
      </template>
    </SwiperLightbox>
  </VOverlay>
</template>

<style scoped>
.swiper-pagination {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
