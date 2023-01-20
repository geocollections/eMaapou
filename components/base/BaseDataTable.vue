<template>
  <div ref="table">
    <!-- HACK: `isLoading = !onlyTable`
      For some reason @update is getting called on created,
      because of that the loading indicator stayies perminantly active
      on tables where update function is not set.
      To fix this for now, tables that have onlyTable prop do not
      enable loading indicator when created.
' -->
    <v-data-table
      id="table"
      item-key="id"
      mobile-breakpoint="0"
      dense
      calculate-widths
      fixed-header
      multi-sort
      style="position: relative"
      :style="cssVars"
      :loading="isLoading"
      :headers="visibleHeaders"
      :items="items"
      :options="options"
      :server-items-length="count"
      hide-default-footer
      :footer-props="footerProps"
      :show-expand="expandable"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :can-scroll-right="canScrollRight"
      :can-scroll-left="canScrollLeft"
      @click:row="handleRowClick"
      @update:options="handleChange($event)"
    >
      <template #no-data>{{ $t('table.noData') }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pagination, updateOptions, options }">
        <div id="top">
          <v-row class="py-2 pl-3" no-gutters>
            <v-col
              cols="12"
              sm="auto"
              md="auto"
              align-self="center"
              class="pr-3 d-flex"
            >
              <v-text-field
                v-if="showSearch"
                v-model="search"
                style="max-width: 400px"
                class="mt-0 pt-0 pr-2 pr-sm-3"
                color="primary darken-2"
                :append-icon="icons.mdiMagnify"
                :label="$t('common.search')"
                hide-details
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
                :pagination="pagination"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="
                  footerProps['items-per-page-text'].toString()
                "
                :page-select-text="
                  $t('common.pageSelect', {
                    current: options.page,
                    count: pagination.pageCount,
                  }).toString()
                "
                :go-to-text="$t('common.goTo').toString()"
                :go-to-button-text="$t('common.goToBtn').toString()"
                select-page-id="header-select-btn"
                @update:options="updateOptions"
              />
            </v-col>
          </v-row>
        </div>
        <v-divider />
      </template>
      <template v-if="!onlyTable" #footer="{ props }">
        <v-divider />
        <v-row no-gutters>
          <v-col class="d-flex justify-end" align-self="center">
            <base-data-table-pagination
              class="py-2"
              :options="props.options"
              :pagination="props.pagination"
              :items-per-page-options="footerProps['items-per-page-options']"
              :items-per-page-text="
                footerProps['items-per-page-text'].toString()
              "
              :page-select-text="
                $t('common.pageSelect', {
                  current: props.options.page,
                  count: props.pagination.pageCount,
                }).toString()
              "
              :go-to-text="$t('common.goTo').toString()"
              :go-to-button-text="$t('common.goToBtn').toString()"
              select-page-id="footer-select-btn"
              @update:options="handleChange($event)"
            />
          </v-col>
        </v-row>
      </template>
      <template
        v-if="expandable"
        #item.data-table-expand="{ expand, isExpanded, item }"
      >
        <v-btn
          v-if="item.canExpand"
          icon
          :class="{ active: isExpanded }"
          @click.stop="expand(!isExpanded)"
        >
          <v-icon v-if="!isExpanded">{{ icons.mdiChevronDown }}</v-icon>
          <v-icon v-else>{{ icons.mdiChevronUp }}</v-icon>
        </v-btn>
      </template>
      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
        <slot :name="slotName" v-bind="context" />
      </template>

      <template #item.date_added="{ item }">
        {{ $formatDate(item.date_added) }}
      </template>

      <template #item.date_changed="{ item }">
        {{ $formatDate(item.date_changed) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { mdiMagnify, mdiChevronUp, mdiChevronDown } from '@mdi/js'
import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'
import {
  defineComponent,
  reactive,
  PropType,
  toRefs,
  useContext,
  computed,
  nextTick,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import BaseDataTableHeaderMenu from '~/components/base/BaseDataTableHeaderMenu.vue'
import BaseDataTableExportMenu from '~/components/base/BaseDataTableExportMenu.vue'
import BaseDataTablePagination from '~/components/base/BaseDataTablePagination.vue'
interface IHeader {
  text: string
  value: string
  show: boolean
  apiFieldValue?: string | { et: string; en: string }
}

export default defineComponent({
  name: 'BaseDataTable',
  components: {
    BaseDataTablePagination,
    BaseDataTableHeaderMenu,
    BaseDataTableExportMenu,
  },
  props: {
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
  },
  setup(props, { emit }) {
    const { i18n } = useContext()
    const state = reactive({
      search: '',
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': i18n.t('table.itemsPerPage'),
      },
      expanded: [],
      // isLoading: false,
      tableElement: null as HTMLTableElement | null,
      canScrollLeft: false,
      canScrollRight: false,
      topOptionsHeight: 0,
    })
    const table = ref<HTMLElement>()
    const visibleHeaders = computed(() => {
      return props.headers.filter((header) => header.show)
    })

    const icons = computed(() => {
      return {
        mdiChevronUp,
        mdiChevronDown,
        mdiMagnify,
      }
    })
    const cssVars = computed(() => {
      return {
        '--top-options-height': `${state.topOptionsHeight}px`,
      }
    })
    const handleChange = debounce((options) => {
      if (
        options.itemsPerPage === props.options.itemsPerPage &&
        options.page === props.options.page &&
        isEqual(options.sortBy, props.options.sortBy) &&
        isEqual(options.sortDesc, props.options.sortDesc)
      )
        return
      emit('update', { options, search: state.search })
    }, 250)
    const handleSearch = debounce(() => {
      const options = { ...props.options, page: 1 }
      // this.isLoading = true
      emit('update', {
        options,
        search: state.search,
      })
    }, 400)
    const handleHeadersChange = (e: any) => {
      emit('change:headers', e.value)
    }
    const handleRowClick = (_: any, slot: any) => {
      // HACK: This is added to handle propagation,
      // as this function does not have a event argument (https://vuetifyjs.com/en/api/v-data-table/#api-events)
      // .stop cannot be used to stop propagation.
      // Right now we check if the target has class 'text-link',
      // if does then we know that the user clicked a link and we do not expand the row.
      // Workaround found from: https://github.com/vuetifyjs/vuetify/issues/1538
      if ((event?.target as Element)?.classList.contains('text-link')) return
      slot.expand(!slot.isExpanded)
    }
    onMounted(() => {
      state.tableElement = table.value?.querySelector('table') ?? null
      nextTick(() => {
        state.topOptionsHeight =
          table.value?.querySelector('#top')?.clientHeight ?? 0
      })
      const dataTableWrapper = table.value?.querySelector(
        '.v-data-table__wrapper'
      ) as HTMLElement | null
      dataTableWrapper?.addEventListener('scroll', () => {
        if (
          dataTableWrapper.scrollLeft + dataTableWrapper.clientWidth >=
          dataTableWrapper.scrollWidth
        ) {
          state.canScrollRight = false
        } else if (dataTableWrapper.scrollLeft === 0) {
          state.canScrollLeft = false
        } else {
          state.canScrollLeft = true

          state.canScrollRight = true
        }
      })

      window.addEventListener('resize', () => {
        state.topOptionsHeight =
          table.value?.querySelector('#top')?.clientHeight ?? 0
        if (
          dataTableWrapper?.offsetWidth &&
          dataTableWrapper?.scrollWidth &&
          dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
        ) {
          state.canScrollRight = true
        } else {
          state.canScrollLeft = false
          state.canScrollRight = false
        }
      })

      if (
        dataTableWrapper?.offsetWidth &&
        dataTableWrapper?.scrollWidth &&
        dataTableWrapper?.offsetWidth < dataTableWrapper?.scrollWidth
      ) {
        state.canScrollRight = true
      }
    })
    return {
      ...toRefs(state),
      visibleHeaders,
      icons,
      cssVars,
      handleSearch,
      handleHeadersChange,
      handleRowClick,
      handleChange,
      table,
    }
  },
})
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
  ::v-deep .v-data-table__wrapper table::after {
    @extend .scroll-right;
  }
}
.v-data-table[can-scroll-left] {
  ::v-deep .v-data-table__wrapper table::before {
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
  content: '';
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
  content: '';
  display: block;
  position: absolute;
  top: var(--top-options-height);
  bottom: 60px;
  left: 0;
  width: 15px;
  z-index: 3;
}
</style>
