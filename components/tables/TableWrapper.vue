<template>
  <v-card :flat="$attrs.flat">
    <v-data-table
      id="table"
      item-key="id"
      mobile-breakpoint="0"
      dense
      calculate-widths
      multi-sort
      :loading="isLoading"
      :headers="headers"
      :items="items"
      :options="options"
      :server-items-length="count"
      :footer-props="footerProps"
      :hide-default-footer="onlyTable"
      :show-expand="expandable"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      @update:options="
        isLoading = true
        handleChange($event)
      "
    >
      <template #no-data>{{ $t('table.noData') }}</template>
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template v-if="!onlyTable" #top="{ pagination, updateOptions, options }">
        <div>
          <v-row no-gutters>
            <v-col v-if="showSearch" cols="12" sm="4" class="py-0 px-3">
              <v-text-field
                v-model="search"
                color="primary darken-2"
                append-icon="mdi-magnify"
                :label="$t('common.search')"
                hide-details
                clearable
                @input="handleSearch"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="auto" class="px-3 my-3" align-self="center">
              <v-menu transition="slide-y-transition" offset-y bottom right>
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    aria-label="export table"
                    class="d-block"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('common.export') }}
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="handleExportCsv()">
                    <v-list-item-title>CSV</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="handleExportExcel()">
                    <v-list-item-title>XLSX (Excel)</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="handleClipboard()">
                    <v-list-item-title>
                      {{ $t('common.clipboard') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col>
              <v-data-footer
                style="border: none"
                :pagination="pagination"
                :options="options"
                :show-first-last-page="footerProps.showFirstLastPage"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                @update:options="updateOptions"
              />
            </v-col>
          </v-row>
        </div>
      </template>
      <template
        v-if="expandable"
        #item.data-table-expand="{ expand, isExpanded, item }"
      >
        <v-btn
          v-if="item.canExpand"
          icon
          :class="{ active: isExpanded }"
          @click="expand(!isExpanded)"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
        <slot :name="slotName" v-bind="context" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { debounce } from 'lodash'
import exportMixin from '~/mixins/exportMixin'

export default {
  name: 'TableWrapper',
  mixins: [exportMixin],
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
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 500),
  },
}
</script>
