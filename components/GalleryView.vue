<script setup lang="ts">
import { mdiFileDownloadOutline } from "@mdi/js";
import { useDisplay } from "vuetify";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  count: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object,
    default: () => ({
      page: 1,
      itemsPerPage: 25,
    }),
  },
});

const emit = defineEmits(["update"]);
const { t } = useI18n();
const localePath = useLocalePath();
const img = useImage();

const activeIndex = ref(0);
const imageSizes = ref(["small", "medium", "large", "original"]);
const footerProps = {
  "showFirstLastPage": true,
  "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
  "items-per-page-text": t("table.itemsPerPage"),
};

const display = useDisplay();

const carouselHeight = computed(() => {
  if (display.xs.value)
    return "35vh";
  else if (display.sm.value)
    return "40vh";
  else return "600px";
});

const pagination = computed(() => ({
  pageCount: Math.ceil(props.count / props.options.itemsPerPage),
}));

watch(
  () => props.items,
  () => {
    activeIndex.value = 0;
  },
);

onBeforeMount(() => {
  window.addEventListener("keyup", handleKeyup);
});
onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyup);
});

function handleThumbnailClick(newIndex) {
  activeIndex.value = newIndex;
}

function handleKeyup(e) {
  if (props.items?.length > 0) {
    if (e.keyCode === 37) {
      // ArrowLeft
      if (activeIndex.value === 0)
        activeIndex.value = props.items.length - 1;
      else activeIndex.value -= 1;
    }
    else if (e.keyCode === 39) {
      // ArrowRight
      if (activeIndex.value === props.items.length - 1)
        activeIndex.value = 0;
      else activeIndex.value += 1;
    }
  }
}

function updateOptions(event) {
  emit("update", { options: event });
}
</script>

<template>
  <VCard v-if="items && items.length > 0" flat>
    <div class="d-flex justify-end">
      <BaseDataTablePagination
        :options="options"
        :pagination="pagination"
        :items-per-page-options="footerProps['items-per-page-options']"
        :items-per-page-text="footerProps['items-per-page-text']"
        :page-select-text="
          $t('common.pageSelect', {
            current: options.page,
            count: pagination.pageCount,
          })
        "
        :go-to-text="$t('common.goTo')"
        :go-to-button-text="$t('common.goToBtn')"
        select-page-id="header-select-btn"
        @update:options="updateOptions"
      />
    </div>

    <VCard flat>
      <div class="px-4">
        <VCardText v-if="items && items.length > 1" class="px-0 pt-0">
          <div class="d-flex align-center" style="overflow-x: auto">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="my-2 mx-2"
            >
              <VHover v-slot="{ hover }">
                <VImg
                  :src="
                    img(
                      `${item.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  :lazy-src="
                    img(
                      `${item.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  width="100"
                  cover
                  aspect-ratio="1"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                    'active-thumbnail': activeIndex === index,
                  }"
                  class="rounded transition-swing cursor-pointer"
                  @click="handleThumbnailClick(index)"
                >
                  <template #placeholder>
                    <VRow
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <VProgressCircular
                        indeterminate
                        color="grey-lighten-5"
                      />
                    </VRow>
                  </template>
                </VImg>
              </VHover>
            </div>
          </div>
          <VCarousel
            v-model="activeIndex"
            style="max-width: 1000px"
            :height="carouselHeight"
            hide-delimiters
            hide-delimiter-background
            class="mt-2 rounded mx-auto gallery__v-carousel"
          >
            <VCarouselItem
              v-for="(item, index) in items"
              :key="index"
              nuxt
              :to="localePath({ name: 'file-id', params: { id: item.id } })"
              :src="
                img(
                  `${item.uuid_filename}`,
                  { size: 'medium' },
                  { provider: 'geocollections' },
                )
              "
            />
          </VCarousel>

          <div
            class="d-flex justify-center flex-column justify-sm-space-between flex-sm-row"
            style="max-width: 1000px; margin-left: auto; margin-right: auto"
          >
            <div class="text-center text-sm-left">
              <div
                v-if="
                  items[activeIndex].agent || items[activeIndex].author_free
                "
              >
                <b>{{ $t("photo.author") }}: </b>{{
                  items[activeIndex].agent || items[activeIndex].author_free
                }}
              </div>
              <div
                v-if="
                  items[activeIndex].date_created
                    || items[activeIndex].date_created_free
                "
              >
                <b>{{ $t("photo.date") }}: </b>
                <span v-if="items[activeIndex].date_created">{{
                  items[activeIndex].date_created.split("T")[0]
                }}</span>
                <span v-else>{{ items[activeIndex].date_created_free }}</span>
              </div>
            </div>

            <div class="text-center">
              <span v-for="(size, index) in imageSizes" :key="index">
                <a
                  class="text-link"
                  @click="$openImage(items[activeIndex].uuid_filename, size)"
                >
                  {{ $t(`common.${size}`) }}
                  <VIcon
                    v-if="size === 'original'"
                    size="small"
                    color="primary-darken-2"
                  >
                    {{ mdiFileDownloadOutline }}
                  </VIcon>
                </a>
                <span v-if="index < imageSizes.length - 1">| </span>
              </span>
            </div>
          </div>
        </VCardText>
      </div>
    </VCard>
  </VCard>
</template>

<style scoped lang="scss">
.active-thumbnail {
  /* elevation-4 */
  /*box-shadow: 0 2px 4px -1px rgba(1, 87, 155, 0.8),*/
  /*  0 4px 5px 0 rgba(1, 87, 155, 0.56), 0 1px 10px 0 rgba(1, 87, 155, 0.44) !important;*/

  box-shadow:
    0 2px 4px -1px rgba(48, 145, 181, 0.8),
    0 2px 5px 0 rgba(48, 145, 181, 0.56),
    0 1px 5px 0 rgba(48, 145, 181, 0.44) !important;

  /* elevation-2 */
  /*box-shadow: 0 3px 1px -2px rgba(62, 163, 202, 0.4),*/
  /*  0 2px 2px 0 rgba(62, 163, 202, 0.28), 0 1px 5px 0 rgba(62, 163, 202, 0.22) !important;*/
}

/* Overriding default 'cover' setting in order to correctly show portrait images */
.gallery__v-carousel >>> .v-carousel__item > .v-image__image--cover {
  background-size: contain;
}
</style>
