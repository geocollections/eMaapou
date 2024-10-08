<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
import type { DataTableOptions } from "~/constants";
import type { DrillcoreBox } from "~/pages/drillcore/[id]/boxes.vue";

const props = withDefaults(
  defineProps<{
    items: DrillcoreBox[];
    options: DataTableOptions;
    count?: number;
    showSearch?: boolean;
  }>(),
  { count: 0, showSearch: true },
);

const emit = defineEmits<{
  update: [payload: { options: DataTableOptions; search: string }];
  click: [box: DrillcoreBox, position: number];
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const localeRoute = useLocaleRoute();

const search = ref("");
const searchDebounced = useDebounce(search, 250);
const isLoading = ref(false);
const footerProps = ref({
  "showFirstLastPage": true,
  "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
  "items-per-page-text": t("table.itemsPerPage"),
});

const pagination = computed(() => ({
  pageCount: Math.ceil(props.count / props.options.itemsPerPage),
}));

watch(
  () => props.items,
  () => {
    isLoading.value = false;
  },
);

watch(searchDebounced, () => {
  handleSearch();
});

function boxHasInfo(box: any) {
  return (
    box.depth_start
    || box.depth_end
    || box.stratigraphy_top
    || box.stratigraphy_base
    || box.depth_other
    || box.remarks
  );
}

function handleChange(options: DataTableOptions) {
  emit("update", { options, search: search.value });
}

function handleSearch() {
  const options = { ...props.options, page: 1 };
  isLoading.value = true;
  emit("update", { options, search: search.value });
}

function getPosition(index: number, page: number, perPage: number) {
  return (page - 1) * perPage + index;
}
</script>

<template>
  <div>
    <VRow class="py-2" no-gutters>
      <VCol
        v-if="showSearch"
        align-self="center"
        cols="12"
        sm="4"
        class="px-3"
      >
        <VTextField
          v-model="search"
          class="pt-0 mt-0"
          color="primary-darken-2"
          :label="$t('common.search')"
          :prepend-inner-icon="mdiMagnify"
          variant="outlined"
          density="compact"
          single-line
          hide-details
          clearable
        />
      </VCol>
      <VCol class="d-flex justify-end" align-self="center">
        <BaseDataTablePagination
          :options="options"
          :page-count="pagination.pageCount"
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
          @update:options="handleChange"
        />
      </VCol>
    </VRow>
    <VRow no-gutters>
      <VCol
        v-for="(box, index) in items"
        :key="box.id"
        cols="12"
        class="pa-0 drillcore-box"
      >
        <VDivider />
        <VHover v-slot="{ isHovering, props: hoverProps }">
          <VCard
            v-bind="hoverProps"
            flat
            :ripple="false"
            :to="
              localeRoute({
                name: 'drillcore-box-id',
                params: { id: box.id },
              })
            "
            @click="emit('click', box, getPosition(index, options.page, options.itemsPerPage))"
          >
            <VCardText class="drillcore-box__card">
              <VRow align="start">
                <VCol
                  cols="12"
                  sm="8"
                  align-self="center"
                >
                  <div
                    v-if="box.image"
                    class="d-flex justify-center"
                  >
                    <NuxtImg
                      :src="box.image"
                      provider="geocollections"
                      :modifiers="{ size: 'medium' }"
                      class="rounded"
                      style="width: 100%; max-width: 1000px; max-height: 800px"
                    />
                  </div>
                  <div
                    v-else
                    class="d-flex align-center justify-center bg-grey-lighten-2 rounded mx-auto"
                    style="height: 300px; max-width: 1000px;"
                  >
                    <div class="text-h5 text-medium-emphasis">
                      {{ $t('drillcoreBox.noImage') }}
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" sm="4">
                  <VCardTitle class="px-0 pt-0 montserrat">
                    {{
                      $t("drillcoreBox.nr", {
                        number: box.number,
                      })
                    }}
                  </VCardTitle>
                  <BaseTable
                    v-if="boxHasInfo(box)"
                    class="transition-swing"
                    :class="{
                      'elevation-2': isHovering,
                      'elevation-0': !isHovering,
                    }"
                    :style="{
                      'background-color': isHovering ? 'white' : 'transparent',
                    }"
                  >
                    <TableRow
                      :title="$t('drillcoreBox.depthStart')"
                      :value="box.depth_start"
                    />
                    <TableRow
                      :title="$t('drillcoreBox.depthEnd')"
                      :value="box.depth_end"
                    />
                    <TableRow
                      v-if="box.stratigraphy_top"
                      :title="$t('drillcoreBox.stratigraphyTop')"
                      :value="box.stratigraphy_top"
                    >
                      <template #value="{ value }">
                        <BaseLink
                          :to="
                            localePath({
                              name: 'stratigraphy-id',
                              params: { id: value.id },
                            })
                          "
                        >
                          {{
                            $translate({
                              et: value.name,
                              en: value.name_en,
                            })
                          }}
                        </BaseLink>
                      </template>
                    </TableRow>
                    <TableRow
                      v-if="box.stratigraphy_base"
                      :title="$t('drillcoreBox.stratigraphyBase')"
                      :value="box.stratigraphy_base"
                    >
                      <template #value="{ value }">
                        <BaseLink
                          :to="
                            localePath({
                              name: 'stratigraphy-id',
                              params: { id: value.id },
                            })
                          "
                        >
                          {{
                            $translate({
                              et: value.name,
                              en: value.name_en,
                            })
                          }}
                        </BaseLink>
                      </template>
                    </TableRow>
                    <TableRow
                      :title="$t('drillcoreBox.depthOther')"
                      :value="box.depth_other"
                    />
                    <TableRow
                      :title="$t('drillcoreBox.remarks')"
                      :value="box.remarks"
                    />
                  </BaseTable>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VHover>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.drillcore-box:nth-of-type(odd) > .v-card > .drillcore-box__card {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
