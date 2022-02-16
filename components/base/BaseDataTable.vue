<template>
  <!-- HACK: line 28 'isLoading = !onlyTable is hacky.
      For some reason @update is getting called on created,
      because of that the loading indicator stayies perminantly active
      on tables where update function is not set.
      To fix this for now, tables that have onlyTable prop do not
      enable loading indicator when created.
' -->
  <v-card :flat="$attrs.flat">
    <v-data-table
      id="table"
      item-key="id"
      mobile-breakpoint="0"
      dense
      calculate-widths
      multi-sort
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
      @click:row="handleRowClick"
      @update:options="
        isLoading = !onlyTable
        handleChange($event)
      "
    >
      <template #no-data>{{ $t('table.noData') }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pagination, updateOptions, options }">
        <div>
          <v-row no-gutters>
            <v-col v-if="showSearch" cols="12" sm="4" class="px-3 py-0">
              <v-text-field
                v-model="search"
                color="primary darken-2"
                append-icon="mdi-magnify"
                :label="$t('common.search')"
                hide-details
                clearable
                @input="handleSearch($event)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col
              cols="12"
              sm="auto"
              class="px-3 my-1 my-sm-3"
              align-self="center"
            >
              <base-data-table-export-menu />
              <base-data-table-header-menu
                v-if="dynamicHeaders"
                :headers="headers"
                :visible-headers="visibleHeaders"
                :sort-by="options.sortBy"
                @change="handleHeadersChange"
                @reset="$emit('reset:headers')"
              />
            </v-col>
            <v-col>
              <base-data-table-pagination
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
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-if="!onlyTable" #footer="{ props }">
        <base-data-table-pagination
          class="py-3"
          :options="props.options"
          :pagination="props.pagination"
          :items-per-page-options="footerProps['items-per-page-options']"
          :items-per-page-text="footerProps['items-per-page-text']"
          :page-select-text="
            $t('common.pageSelect', {
              current: props.options.page,
              count: props.pagination.pageCount,
            })
          "
          :go-to-text="$t('common.goTo')"
          :go-to-button-text="$t('common.goToBtn')"
          select-page-id="footer-select-btn"
          @update:options="
            isLoading = !onlyTable
            handleChange($event)
          "
        />
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
          <v-icon v-if="!isExpanded">mdi-chevron-down</v-icon>
          <v-icon v-else>mdi-chevron-up</v-icon>
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
  </v-card>
</template>

<script>
import { debounce } from 'lodash'
import BaseDataTableHeaderMenu from '~/components/base/BaseDataTableHeaderMenu.vue'
import BaseDataTableExportMenu from '~/components/base/BaseDataTableExportMenu.vue'
import BaseDataTablePagination from '~/components/base/BaseDataTablePagination.vue'
export default {
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
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
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
  },
  data() {
    return {
      search: '',
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
      expanded: [],
      isLoading: false,
    }
  },
  computed: {
    visibleHeaders() {
      return this.headers.filter((header) => header.show)
    },
  },
  watch: {
    items() {
      this.isLoading = false
    },
  },
  methods: {
    handleChange: debounce(function (options) {
      this.$emit('update', { options, search: this.search })
    }, 500),
    handleSearch: debounce(function () {
      const options = { ...this.options, page: 1 }
      this.isLoading = true
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 500),
    handleHeadersChange(e) {
      this.$emit('change:headers', e.value)
    },
    handleRowClick(item, slot) {
      // HACK: This is added to handle propagation,
      // as this function does not have a event argument (https://vuetifyjs.com/en/api/v-data-table/#api-events)
      // .stop cannot be used to stop propagation.
      // Right now we check if the target has class 'text-link',
      // if does then we know that the user clicked a link and we do not expand the row.
      // Workaround found from: https://github.com/vuetifyjs/vuetify/issues/1538
      if (event.target.classList.contains('text-link')) return
      slot.expand(!slot.isExpanded)
    },
  },
}
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
    &.sortable {
      white-space: nowrap;
    }
  }
}
</style>
