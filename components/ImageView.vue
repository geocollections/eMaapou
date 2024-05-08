<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";

const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  count: {
    type: Number,
    default: 0,
  },
  options: {
    type: Object as PropType<DataTableOptions>,
    default: () => ({
      page: 1,
      itemsPerPage: 25,
    }),
  },
});

const emit = defineEmits(["update", "click:row"]);

const { t } = useI18n();
const localePath = useLocalePath();
const img = useImage();

const footerProps = {
  "showFirstLastPage": true,
  "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
  "items-per-page-text": t("table.itemsPerPage"),
};
const cropImages = ref(true);

const pagination = computed(() => ({
  pageCount: Math.ceil(props.count / props.options.itemsPerPage),
}));

function updateOptions(event: DataTableOptions) {
  emit("update", { options: event });
}
</script>

<template>
  <div class="bg-white">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="auto"
        class="px-3 my-1 my-sm-4"
        align-self="center"
      >
        <VSwitch
          v-model="cropImages"
          density="compact"
          class="mt-0 montserrat"
          hide-details
          color="header"
          :label="$t('common.containImages')"
        />
      </VCol>
      <VCol class="d-flex justify-end">
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
      </VCol>
    </VRow>
    <VCard flat>
      <VRow
        v-if="count > 0"
        no-gutters
        class="px-2"
      >
        <VCol
          v-for="(image, index) in items"
          :key="index"
          class=" pt-0 px-2 pb-4"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <VTooltip
            location="bottom"
            color="header"
            z-index="51000"
            max-width="250"
          >
            <template #activator="{ props: tooltipProps }">
              <VCard
                flat
                class="d-flex image-hover"
                color="transparent"
                hover
                :to="localePath({ name: 'file-id', params: { id: image.id } })"
                :class="{ 'image-hover-elevation': !!cropImages }"
                v-bind="tooltipProps"
                @click="emit('click:row', index)"
              >
                <VImg
                  v-if="image.uuid_filename"
                  position="top"
                  max-height="400"
                  aspect-ratio="1"
                  :cover="cropImages"
                  :lazy-src="
                    img(
                      `${image.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  :src="
                    img(
                      `${image.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
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

                <VRow v-else align="center">
                  <VCol class="text-center">
                    <div class="py-3">
                      <VIcon style="font-size: 6rem" class="text-grey">
                        {{ mdiFileImageOutline }}
                      </VIcon>
                    </div>
                  </VCol>
                </VRow>
              </VCard>
            </template>

            <span>
              <b>{{ $t("photo.id") }}: </b> {{ image.id }}<br>
              <span v-if="image.date_created || image.date_created_free">
                <b>{{ $t("photo.date") }}: </b>
                <span v-if="image.date_created">{{
                  image.date_created.split("T")[0]
                }}</span>
                <span v-else>{{ image.date_created_free }}</span>
                <br>
              </span>
              <span v-if="image.agent || image.author_free">
                <b>{{ $t("photo.author") }}: </b>{{ image.agent || image.author_free }}
                <br>
              </span>
              <span v-if="image.image_number">
                <b>{{ $t("photo.number") }}: </b>
                {{ image.image_number }}
                <br>
              </span>
            </span>
          </VTooltip>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>
