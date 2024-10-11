<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";

const props = defineProps<{
  items: any[];
  count: number;
  options: DataTableOptions;
}>();

const emit = defineEmits<{
  "update": [payload: { options: DataTableOptions }];
  "click:row": [row: number];
}>();

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
    <div no-gutters>
      <div
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
      </div>
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
    </div>
    <div flat>
      <div
        v-if="count > 0"
        no-gutters
        class="px-2"
      >
        <div
          v-for="(image, index) in items"
          :key="index"
          class=" pt-0 px-2 pb-4"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <div
            flat
            class="d-flex image-hover"
            color="transparent"
            hover
            :to="localePath({ name: 'file-id', params: { id: image.id } })"
            :class="{ 'image-hover-elevation': !!cropImages }"
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
                <div
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <VProgressCircular
                    indeterminate
                    color="grey-lighten-5"
                  />
                </div>
              </template>
            </VImg>

            <div v-else align="center">
              <div class="text-center">
                <div class="py-3">
                  <div style="font-size: 6rem" class="text-grey">
                    {{ mdiFileImageOutline }}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  </div>
</template>
