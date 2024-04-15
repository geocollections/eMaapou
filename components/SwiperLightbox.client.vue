<script setup lang="ts">
import { mdiFileDownloadOutline, mdiInformationOutline } from "@mdi/js";
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  images: {
    required: true,
    type: Array as PropType<string[]>,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["end", "close"]);
const img = useImage();
const localePath = useLocalePath();
// register Swiper custom elements
register();

const swiper = ref();

watch(() => props.images, () => {
  if (!swiper.value) return;
  nextTick(() => {
    swiper.value.swiper.update();
  });
});

watch(() => props.initialSlide, () => {
  if (!swiper.value) return;
  nextTick(() => {
    swiper.value.swiper.slideTo(props.initialSlide);
  });
});

function handleReachEnd() {
  emit("end");
}

function renderCustomPagination(_s: any, current: number, _total: number) {
  return `${current} / ${props.total}`;
}

function formatTotal(total: number) {
  return total.toString();
}


onMounted(() => {
  nextTick(() => {
    const swiperContainer = swiper.value
    const swiperParams = {
      navigation: true,
      pagination: {
        type: "custom",
        renderCustom: renderCustomPagination,
      },
      keyboard: true,
      initialSlide: props.initialSlide,
      on: {
        reachEnd: handleReachEnd,
      },
      injectStyles: [
      `
      :host .swiper-pagination {
        bottom: unset;
        top: 0;
        color: white;
        text-align: left;
        padding: 0.5rem;
      }
      `,
    ],
    };
    Object.assign(swiperContainer, swiperParams);
    swiperContainer.initialize();
  })
});
</script>
<template>
  <div
    class="w-100 h-100"
    @click.self="emit('close')"
  >
    <swiper-container
      ref="swiper"
      class="w-100 h-100"
      :init="false"
    >
      <swiper-slide
        v-for="(image, index) in images"
        :key="index"
        :lazy="true"
        class="d-flex justify-center align-center"
      >
        <NuxtImg
          :src="image.filename"
          provider="geocollections"
          :modifiers="{ size: 'large' }"
          class="rounded"
          style="max-height: 80vh; max-width: 100%; object-fit: contain"
        />
        <div style="position: absolute; bottom: 1rem;" class="w-100">
          <div class="d-flex justify-center">
            <VBtn
              class="montserrat text-capitalize font-weight-regular mr-2 border"
              nuxt
              :to="
                localePath({
                  name: 'file-id',
                  params: { id: image?.id?.toString() ?? '' },
                })
              "
              flat
              color="info"
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
                :href="img(image.filename, { size: 'small' }, { provider: 'geocollections' })"
                target="_blank"
              >
                {{ $t("common.small") }}
              </VBtn>
              <VBtn
                variant="text"
                class="text-capitalize"
                :href="img(image.filename, { size: 'medium' }, { provider: 'geocollections' })"
                target="_blank"
              >
                {{ $t("common.medium") }}
              </VBtn>
              <VBtn
                variant="text"
                class="text-capitalize"
                :href="img(image.filename, { size: 'large' }, { provider: 'geocollections' })"
                target="_blank"
              >
                {{ $t("common.large") }}
              </VBtn>
              <VBtn
                variant="text"
                class="text-capitalize"
                :href="img(image.filename, {}, { provider: 'geocollections' })"
                target="_blank"
              >
                {{ $t("common.original") }}
              </VBtn>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>
</template>
