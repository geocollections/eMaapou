<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";

const props = defineProps<{
  items: any[];
  count: number;
  options: DataTableOptions;
}>();

const emit = defineEmits<{
  update: [payload: { options: DataTableOptions }];
}>();
const localePath = useLocalePath();
const img = useImage();
const { t } = useI18n();

const footerProps = ref({
  "showFirstLastPage": true,
  "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
  "items-per-page-text": t("table.itemsPerPage"),
});

const cropImages = ref(true);

const pagination = computed(() => {
  return { pageCount: Math.ceil(props.count / props.options.itemsPerPage) };
});

function updateOptions(event: DataTableOptions) {
  emit("update", { options: event });
}
</script>

<template>
  <div class="bg-white">
    <VRow class="border-b" no-gutters>
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
    <div class="py-2">
      <VRow
        v-if="count > 0"
        no-gutters
        class="px-2"
      >
        <VCol
          v-for="(image, index) in items"
          :key="index"
          class="pt-0 px-2 pb-4"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <NuxtLink
            class="text-link"
            :to="
              localePath({
                name: 'specimen-id',
                params: { id: image.specimen_id },
              })
            "
          >
            {{ image.specimen_full_name }}
          </NuxtLink>
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
              >
                <VImg
                  v-if="image.image"
                  position="top"
                  :contain="!cropImages"
                  :lazy-src="
                    img(
                      `${image.image}`,
                      { size: 'small' },
                      { provider: 'geocollections' },
                    )
                  "
                  :src="
                    img(
                      `${image.image}`,
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
              <b>{{ $t('photo.id') }}: </b> {{ image.id }}<br>
              <span v-if="image.date_created || image.date_created_free">
                <b>{{ $t('photo.date') }}: </b>
                <span v-if="image.date_created">{{
                  image.date_created.split('T')[0]
                }}</span>
                <span v-else>{{ image.date_created_free }}</span>
                <br>
              </span>
              <span v-if="image.agent || image.author_free">
                <b>{{ $t('photo.author') }}: </b>{{ image.agent || image.author_free }}
                <br>
              </span>
              <span v-if="image.image_number">
                <b>{{ $t('photo.number') }}: </b>
                {{ image.image_number }}
                <br>
              </span>
            </span>
          </VTooltip>
        </VCol>
      </VRow>
    </div>
  </div>
</template>
