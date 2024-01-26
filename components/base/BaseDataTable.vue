<template>
  <div ref="table">
    <!-- HACK: `isLoading = !onlyTable`
      For some reason @update is getting called on created,
      because of that the loading indicator stayies perminantly active
      on tables where update function is not set.
      To fix this for now, tables that have onlyTable prop do not
      enable loading indicator when created.
' -->
    <v-data-table-server
      id="table"
      item-key="id"
      mobile-breakpoint="0"
      density="compact"
      calculate-widths
      fixed-header
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
      v-model:expanded="expanded"
      :can-scroll-right="canScrollRight"
      :can-scroll-left="canScrollLeft"
      @update:sortBy="handleSortByChange"
    >
      <template #no-data>{{ $t("table.noData") }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pageCount }">
        <div id="top">
          <v-row class="pl-3" no-gutters>
            <v-col
              cols="12"
              sm="5"
              md="4"
              lg="3"
              align-self="center"
              class="pr-3 d-flex align-center"
            >
              <v-text-field
                v-if="showSearch"
                v-model="search"
                style="max-width: 400px"
                class="d-block mt-0 pt-0 pr-2 pr-sm-3"
                color="primary-darken-2"
                :prepend-inner-icon="mdiMagnify"
                :label="$t('common.search')"
                hide-details
                variant="underlined"
                density="compact"
                single-line
                clearable
                @input="handleSearch"
              />
              <base-data-table-export-menu
                v-if="tableElement"
                :table-element="tableElement"
              />
              <base-data-table-header-menu
                v-if="dynamicHeaders"
                :headers="headers"
                :visible-headers="visibleHeaders"
                :sort-by="options.sortBy"
                @change="handleHeadersChange"
                @reset="$emit('reset:headers')"
              />
            </v-col>
            <v-col class="d-flex justify-end" align-self="center">
              <base-data-table-pagination
                :options="options"
                :page-count="pageCount"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                :page-select-text="
                  $t('common.pageSelect', {
                    current: options.page,
                    count: pageCount,
                  })
                "
                :go-to-text="$t('common.goTo')"
                :go-to-button-text="$t('common.goToBtn')"
                select-page-id="footer-select-btn"
                @update:options="handleChange"
              />
            </v-col>
          </v-row>
        </div>
        <v-divider />
      </template>
      <template v-if="!onlyTable" #bottom="{ pageCount }">
        <v-divider />
        <v-row no-gutters>
          <v-col class="d-flex justify-end" align-self="center">
            <base-data-table-pagination
              :options="options"
              :page-count="pageCount"
              :items-per-page-options="footerProps['items-per-page-options']"
              :items-per-page-text="footerProps['items-per-page-text']"
              :page-select-text="
                $t('common.pageSelect', {
                  current: options.page,
                  count: pageCount,
                })
              "
              :go-to-text="$t('common.goTo')"
              :go-to-button-text="$t('common.goToBtn')"
              select-page-id="footer-select-btn"
              @update:options="handleChange($event)"
            />
          </v-col>
        </v-row>
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
        <v-btn
          v-if="item.canExpand"
          :icon="!isExpanded(internalItem) ? mdiChevronDown : mdiChevronUp"
          variant="text"
          size="small"
          :class="{ active: isExpanded }"
          @click="toggleExpand(internalItem)"
        >
        </v-btn>
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
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { mdiMagnify, mdiChevronUp, mdiChevronDown } from "@mdi/js";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
interface IHeader {
  text: string;
  value: string;
  show: boolean;
  apiFieldValue?: string | { et: string; en: string };
}

const props = defineProps({
  onlyTable: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array as PropType<IHeader[]>,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  expandable: {
    type: Boolean,
    default: false,
  },
  singleExpand: {
    type: Boolean,
    default: false,
  },
  dynamicHeaders: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update", "reset:headers", "change:headers"]);
const { t } = useI18n();
const { $formatDate } = useNuxtApp();

const search = ref("");
const footerProps = ref({
  showFirstLastPage: true,
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
  return props.headers.filter((header) => header.show);
});

const cssVars = computed(() => {
  return {
    "--top-options-height": `${topOptionsHeight.value}px`,
  };
});
const handleChange = debounce((options) => {
  if (
    options.itemsPerPage === props.options.itemsPerPage &&
    options.page === props.options.page &&
    isEqual(options.sortBy, props.options.sortBy) &&
    isEqual(options.sortDesc, props.options.sortDesc)
  )
    return;
  emit("update", { options, search: search.value });
}, 250);
const handleSortByChange = (newSortBy) => {
  if (isEqual(newSortBy, props.options.sortBy)) return;
  emit("update", {
    options: { ...props.options, page: 1, sortBy: newSortBy },
    search: search.value,
  });
};

const handleSearch = debounce(() => {
  const options = { ...props.options, page: 1 };
  // this.isLoading = true
  emit("update", {
    options,
    search: search.value,
  });
}, 400);
const handleHeadersChange = (e: any) => {
  emit("change:headers", e.value);
};
onMounted(() => {
  tableElement.value = table.value?.querySelector("table") ?? null;
  nextTick(() => {
    topOptionsHeight.value =
      table.value?.querySelector("#top")?.clientHeight ?? 0;
  });
  const dataTableWrapper = table.value?.querySelector(
    ".v-table__wrapper"
  ) as HTMLElement | null;
  dataTableWrapper?.addEventListener("scroll", () => {
    if (
      dataTableWrapper.scrollLeft + dataTableWrapper.clientWidth >=
      dataTableWrapper.scrollWidth
    ) {
      canScrollRight.value = false;
    } else if (dataTableWrapper.scrollLeft === 0) {
      canScrollLeft.value = false;
    } else {
      canScrollLeft.value = true;
      canScrollRight.value = true;
    }
  });

  window.addEventListener("resize", () => {
    topOptionsHeight.value =
      table.value?.querySelector("#top")?.clientHeight ?? 0;
    if (
      dataTableWrapper?.offsetWidth &&
      dataTableWrapper?.scrollWidth &&
      dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
    ) {
      canScrollRight.value = true;
    } else {
      canScrollLeft.value = false;
      canScrollRight.value = false;
    }
  });

  if (
    dataTableWrapper?.offsetWidth &&
    dataTableWrapper?.scrollWidth &&
    dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
  ) {
    canScrollRight.value = true;
  }
});
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep {
  .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  tbody > tr:nth-of-type(odd):not(.v-data-table__expanded__content) {
    background-color: rgba(0, 0, 0, 0.03);
  }

  th {
    // position: sticky;
    // top: 0px;
    background-color: white;

    &.sortable {
      white-space: nowrap;
    }
  }
}
.v-data-table[can-scroll-right] {
  :deep(.v-data-table__wrapper) table::after {
    @extend .scroll-right;
  }
}
.v-data-table[can-scroll-left] {
  :deep(.v-data-table__wrapper) table::before {
    @extend .scroll-left;
  }
}

.scroll-right {
  background: -webkit-linear-gradient(
      270deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%
    )
    100% center;
  background: linear-gradient(
      270deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%
    )
    100% center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 15px 100%;
  background-position: 100% 0%;
  content: "";
  display: block;
  position: absolute;
  top: var(--top-options-height);
  bottom: 60px;
  right: 0;
  width: 15px;
  z-index: 3;
}
.scroll-left {
  background: -webkit-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%
    )
    0 center;
  background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 75%
    )
    0 center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 15px 100%;
  background-position: 100% 0%;
  content: "";
  display: block;
  position: absolute;
  top: var(--top-options-height);
  bottom: 60px;
  left: 0;
  width: 15px;
  z-index: 3;
}
</style>
