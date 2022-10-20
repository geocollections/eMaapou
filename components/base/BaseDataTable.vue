<template>
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
    @update:options="handleChange($event)"
  >
    <template #no-data>{{ $t('table.noData') }}</template>
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template v-if="!onlyTable" #top="{ pagination, updateOptions, options }">
      <div>
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
              append-icon="mdi-magnify"
              :label="$t('common.search')"
              hide-details
              single-line
              clearable
              @input="handleSearch($event)"
            ></v-text-field>
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
      <v-row no-gutters>
        <v-col class="d-flex justify-end" align-self="center">
          <base-data-table-pagination
            class="py-2"
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
</template>

<script lang="ts">
import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'
import Vue, { PropType } from 'vue'
import BaseDataTableHeaderMenu from '~/components/base/BaseDataTableHeaderMenu.vue'
import BaseDataTableExportMenu from '~/components/base/BaseDataTableExportMenu.vue'
import BaseDataTablePagination from '~/components/base/BaseDataTablePagination.vue'

interface IHeader {
  text: string
  value: string
  show: boolean
  apiFieldValue?: string | { et: string; en: string }
}

export default Vue.extend({
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
  data() {
    return {
      search: '',
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
      expanded: [],
      // isLoading: false,
      tableElement: null,
    }
  },
  computed: {
    visibleHeaders(): IHeader[] {
      return this.headers.filter((header) => header.show)
    },
  },
  // mounted() {
  //   this.tableElement = this.$el.querySelector('table')
  // },
  methods: {
    handleChange: debounce(function (this: any, options) {
      if (
        options.itemsPerPage === this.options.itemsPerPage &&
        options.page === this.options.page &&
        isEqual(options.sortBy, this.options.sortBy) &&
        isEqual(options.sortDesc, this.options.sortDesc)
      )
        return
      this.$emit('update', { options, search: this.search })
    }, 250),
    handleSearch: debounce(function (this: any) {
      const options = { ...this.options, page: 1 }
      // this.isLoading = true
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 400),
    handleHeadersChange(e: any) {
      this.$emit('change:headers', e.value)
    },
    handleRowClick(_: any, slot: any) {
      // HACK: This is added to handle propagation,
      // as this function does not have a event argument (https://vuetifyjs.com/en/api/v-data-table/#api-events)
      // .stop cannot be used to stop propagation.
      // Right now we check if the target has class 'text-link',
      // if does then we know that the user clicked a link and we do not expand the row.
      // Workaround found from: https://github.com/vuetifyjs/vuetify/issues/1538
      if ((event?.target as Element)?.classList.contains('text-link')) return
      slot.expand(!slot.isExpanded)
    },
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
</style>
