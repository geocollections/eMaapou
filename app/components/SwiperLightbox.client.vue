<script setup lang="ts" generic="T">
import type { Image } from "./ImageBar.vue";
import { mdiFileDownloadOutline, mdiInformationOutline } from "@mdi/js";
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";

const props = withDefaults(defineProps<
  {
    total: number;
    images: Image<T>[];
    initialSlide?: number;
  }
>(), { initialSlide: 0 });

const emit = defineEmits<{
  end: [];
  close: [];
}>();
const img = useImage();
const localePath = useLocalePath();
// register Swiper custom elements
register();

const swiper = ref();

watch(() => props.images, () => {
  if (!swiper.value)
    return;
  nextTick(() => {
    swiper.value.swiper.update();
  });
});

watch(() => props.initialSlide, () => {
  if (!swiper.value)
    return;
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

const showInfo = ref(true);

onMounted(() => {
  nextTick(() => {
    const swiperContainer = swiper.value;
    const swiperParams = {
      zoom: true,
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

    swiperContainer.addEventListener("swiperclick", () => {
      showInfo.value = !showInfo.value;
    });

    swiperContainer.addEventListener("swiperslidechangetransitionend", () => {
      showInfo.value = true;
    });
    swiperContainer.initialize();
  });
});

const { start } = useTimeoutFn(() => {
  showInfo.value = false;
}, 5000);

const { x, y, isOutside } = useMouseInElement(swiper);

watch(showInfo, (value) => {
  if (value)
    start();
});

watch([isOutside, x, y], ([newIsOutside, newX, newY], [_oldIsOutside, oldX, oldY]) => {
  if (!newIsOutside && newX !== oldX && newY !== oldY)
    showInfo.value = true;
});

defineExpose({
  reset,
});

function reset() {
  swiper.value?.swiper.slideTo(0);
}
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
        <div class="swiper-zoom-container">
          <NuxtImg
            :src="image.filename"
            provider="geocollections"
            :modifiers="{ size: 'large' }"
            class="rounded"
            style="max-height: 80vh; max-width: 100%; object-fit: contain"
          />
        </div>
        <Transition>
          <div
            v-show="showInfo"
            style="position: absolute; bottom: 0; background-color: rgba(0, 0, 0, 0.65);"
            class="w-100"
          >
            <div id="divider" class="mb-2 text-white" />
            <div class="mx-4 mb-4">
              <div class="text-white my-2">
                <slot name="info" :item="image" />
              </div>
              <div>
                <div class="mb-2">
                  <button
                    class="montserrat text-capitalize font-weight-regular mr-2"
                    :to="
                      localePath({
                        name: 'file-id',
                        params: { id: image?.id?.toString() ?? '' },
                      })
                    "
                    flat
                    size="small"
                    color="info"
                  >
                    <div start>
                      {{ mdiInformationOutline }}
                    </div>
                    {{ $t("photo.viewDetail") }}
                  </button>
                </div>
                <div class="rounded d-inline-block px-1">
                  <div
                    start
                    color="white"
                  >
                    {{ mdiFileDownloadOutline }}
                  </div>
                  <button
                    variant="text"
                    size="small"
                    color="white"
                    class="text-capitalize"
                    :href="img(image.filename, { size: 'small' }, { provider: 'geocollections' })"
                    target="_blank"
                  >
                    {{ $t("common.small") }}
                  </button>
                  <button
                    variant="text"
                    size="small"
                    color="white"
                    class="text-capitalize"
                    :href="img(image.filename, { size: 'medium' }, { provider: 'geocollections' })"
                    target="_blank"
                  >
                    {{ $t("common.medium") }}
                  </button>
                  <button
                    variant="text"
                    size="small"
                    color="white"
                    class="text-capitalize"
                    :href="img(image.filename, { size: 'large' }, { provider: 'geocollections' })"
                    target="_blank"
                  >
                    {{ $t("common.large") }}
                  </button>
                  <button
                    variant="text"
                    size="small"
                    color="white"
                    class="text-capitalize"
                    :href="img(image.filename, {}, { provider: 'geocollections' })"
                    target="_blank"
                  >
                    {{ $t("common.original") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
