<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp, mdiEye, mdiEyeArrowRight, mdiMagnify } from "@mdi/js";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import type { ExportFunc } from "~/composables/useExport";

interface IHeader {
  text: string;
  value: string;
  show: boolean;
  apiFieldValue?: string | { et: string; en: string };
}

const props = withDefaults(defineProps<
  {
    items: any[];
    headers: IHeader[];
    options: {
      sortBy: string[];
      sortDesc: boolean[];
      page: number;
      itemsPerPage: number;
    };
    count: number;
    isLoading: boolean;
    showSearch?: boolean;
    onlyTable?: boolean;
    expandable?: boolean;
    singleExpand?: boolean;
    dynamicHeaders?: boolean;
    exportFunc?: ExportFunc;
    itemTo?: (item: any) => string;
    externalTo: boolean;
  }
>(), {
  showSearch: true,
  onlyTable: false,
  expandable: false,
  singleExpand: false,
  dynamicHeaders: true,
  externalTo: false,
});

const emit = defineEmits(["update", "reset:headers", "change:headers", "click:row"]);
const { t } = useI18n();
const { $formatDate } = useNuxtApp();

const search = ref("");
const footerProps = ref({
  "showFirstLastPage": true,
  "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
  "items-per-page-text": t("table.itemsPerPage"),
});
const expanded = ref([]);
const tableElement = ref<HTMLTableElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const topOptionsHeight = ref(0);
const table = ref<HTMLElement>();
const visibleHeaders = computed(() => {
  const contentHeaders = props.headers.filter(header => header.show);
  if (props.itemTo) {
    contentHeaders.unshift({
      text: "",
      value: "to",
      show: true,
      sortable: false,
      width: "2rem",
    });
  }
  contentHeaders.push({
    text: "",
    value: "",
    show: true,
    sortable: false,
  });
  return contentHeaders;
});

const cssVars = computed(() => {
  return {
    "--top-options-height": `${topOptionsHeight.value}px`,
  };
});
const handleChange = debounce((options) => {
  if (
    options.itemsPerPage === props.options.itemsPerPage
    && options.page === props.options.page
    && isEqual(options.sortBy, props.options.sortBy)
    && isEqual(options.sortDesc, props.options.sortDesc)
  )
    return;
  emit("update", { options, search: search.value });
}, 250);
function handleSortByChange(newSortBy) {
  if (isEqual(newSortBy, props.options.sortBy))
    return;
  emit("update", {
    options: { ...props.options, page: 1, sortBy: newSortBy },
    search: search.value,
  });
}

const handleSearch = debounce(() => {
  const options = { ...props.options, page: 1 };
  // this.isLoading = true
  emit("update", {
    options,
    search: search.value,
  });
}, 400);
function handleHeadersChange(e: any) {
  emit("change:headers", e.value);
}
onMounted(() => {
  tableElement.value = table.value?.querySelector("table") ?? null;
  nextTick(() => {
    topOptionsHeight.value
      = table.value?.querySelector("#top")?.clientHeight ?? 0;
  });
  const dataTableWrapper = table.value?.querySelector(
    ".v-table__wrapper",
  ) as HTMLElement | null;
  dataTableWrapper?.addEventListener("scroll", () => {
    if (
      dataTableWrapper.scrollLeft + dataTableWrapper.clientWidth
      >= dataTableWrapper.scrollWidth
    ) {
      canScrollRight.value = false;
    }
    else if (dataTableWrapper.scrollLeft === 0) {
      canScrollLeft.value = false;
    }
    else {
      canScrollLeft.value = true;
      canScrollRight.value = true;
    }
  });

  window.addEventListener("resize", () => {
    topOptionsHeight.value
      = table.value?.querySelector("#top")?.clientHeight ?? 0;
    if (
      dataTableWrapper?.offsetWidth
      && dataTableWrapper?.scrollWidth
      && dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
    ) {
      canScrollRight.value = true;
    }
    else {
      canScrollLeft.value = false;
      canScrollRight.value = false;
    }
  });

  if (
    dataTableWrapper?.offsetWidth
    && dataTableWrapper?.scrollWidth
    && dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
  )
    canScrollRight.value = true;
});
</script>

<template>
  <div ref="table">
    <VDataTableServer
      id="table"
      v-model:expanded="expanded"
      item-key="id"
      mobile-breakpoint="0"
      density="compact"
      multi-sort
      style="position: relative"
      :style="cssVars"
      :loading="isLoading"
      :headers="visibleHeaders"
      :items="items"
      :sort-by="options.sortBy"
      :items-per-page="options.itemsPerPage"
      :items-length="count"
      :footer-props="footerProps"
      :can-scroll-right="canScrollRight"
      :can-scroll-left="canScrollLeft"
      @update:sort-by="handleSortByChange"
    >
      <template #no-data>
        {{ $t("table.noData") }}
      </template>
      <template v-if="itemTo" #item.to="{ item, index }">
        <VBtn
          icon
          variant="text"
          class="text-link-visit"
          size="small"
          :to="itemTo(item)"
          @click="emit('click:row', { index, id: item.id })"
        >
          <VIcon size="x-large">
            {{ externalTo ? mdiEyeArrowRight : mdiEye }}
          </VIcon>
        </VBtn>
      </template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pageCount }">
        <div id="top">
          <VRow class="pl-3" no-gutters>
            <VCol
              cols="12"
              sm="5"
              md="4"
              lg="3"
              align-self="center"
              class="pr-3 d-flex align-center"
            >
              <VTextField
                v-if="showSearch"
                v-model="search"
                style="max-width: 400px"
                class="d-block mt-0 pt-0 pr-2 pr-sm-3"
                color="primary-darken-2"
                :prepend-inner-icon="mdiMagnify"
                :label="$t('common.search')"
                hide-details
                variant="outlined"
                density="compact"
                single-line
                clearable
                @update:model-value="handleSearch"
              />
              <BaseDataTableExportMenu
                v-if="exportFunc"
                :table-element="tableElement"
                :export-func="exportFunc"
              />
              <BaseDataTableHeaderMenu
                v-if="dynamicHeaders"
                :headers="headers"
                :visible-headers="visibleHeaders"
                :sort-by="options.sortBy"
                @change="handleHeadersChange"
                @reset="$emit('reset:headers')"
              />
            </VCol>
            <VCol class="d-flex justify-end" align-self="center">
              <BaseDataTablePagination
                :options="options"
                :page-count="pageCount"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                :page-select-text="$t('common.pageSelect', {
                  current: options.page,
                  count: pageCount,
                })
                "
                :go-to-text="$t('common.goTo')"
                :go-to-button-text="$t('common.goToBtn')"
                select-page-id="footer-select-btn"
                @update:options="handleChange"
              />
            </VCol>
          </VRow>
        </div>
        <VDivider />
      </template>
      <template v-if="!onlyTable" #bottom="{ pageCount }">
        <VDivider />
        <VRow no-gutters>
          <VCol class="d-flex justify-end" align-self="center">
            <BaseDataTablePagination
              :options="options"
              :page-count="pageCount"
              :items-per-page-options="footerProps['items-per-page-options']"
              :items-per-page-text="footerProps['items-per-page-text']"
              :page-select-text="$t('common.pageSelect', {
                current: options.page,
                count: pageCount,
              })
              "
              :go-to-text="$t('common.goTo')"
              :go-to-button-text="$t('common.goToBtn')"
              select-page-id="footer-select-btn"
              @update:options="handleChange($event)"
            />
          </VCol>
        </VRow>
      </template>
      <template
        v-if="expandable"
        #item.data-table-expand="{
          toggleExpand,
          item,
          isExpanded,
          internalItem,
        }"
      >
        <VBtn
          v-if="item.canExpand"
          :icon="!isExpanded(internalItem) ? mdiChevronDown : mdiChevronUp"
          variant="text"
          size="small"
          :class="{ active: isExpanded }"
          @click="toggleExpand(internalItem)"
        />
      </template>
      <template v-for="(_, slotName) in $slots" #[slotName]="context">
        <slot :name="slotName" v-bind="context" />
      </template>

      <template #item.date_added="{ item }">
        {{ $formatDate(item.date_added) }}
      </template>

      <template #item.date_changed="{ item }">
        {{ $formatDate(item.date_changed) }}
      </template>
    </VDataTableServer>
  </div>
</template>

<style lang="scss" scoped>
.v-data-table {
  :deep(.v-table__wrapper) tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }

  :deep(tbody)>tr:nth-of-type(odd):not(.v-data-table__expanded__content) {
    background-color: rgba(0, 0, 0, 0.03);
  }

  :deep(thead)>tr>th:last-of-type {
    width: auto !important;
  }

  :deep(tbody)>tr>td:last-of-type {
    width: auto !important;
  }

  :deep(th) {
    // position: sticky;
    // top: 0px;
    background-color: white;

    &.sortable {
      white-space: nowrap;
    }
  }

  :deep(td) {
    border-bottom: none !important;
  }
}

.v-table[can-scroll-right="true"] {
  :deep(.v-table__wrapper) tbody::after {
    @extend .scroll-right;
  }
}

.v-table[can-scroll-left="true"] {
  :deep(.v-table__wrapper) tbody::before {
    @extend .scroll-left;
  }
}

.scroll-right {
  background: -webkit-linear-gradient(270deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%) 100% center;
  background: linear-gradient(270deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%) 100% center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 15px 100%;
  background-position: 100% 0%;
  content: "";
  display: block;
  position: absolute;
  top: var(--top-options-height);
  bottom: 74px;
  right: 0;
  width: 15px;
  // z-index: 3;
}

.scroll-left {
  background: -webkit-linear-gradient(90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%) 0 center;
  background: linear-gradient(90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%) 0 center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 15px 100%;
  background-position: 100% 0%;
  content: "";
  display: block;
  position: absolute;
  top: var(--top-options-height);
  bottom: 74px;
  left: 0;
  width: 15px;
  // z-index: 3;
}
</style>
