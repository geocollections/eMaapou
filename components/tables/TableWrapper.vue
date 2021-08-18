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
      :headers="headers"
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
            <v-col v-if="showSearch" cols="12" sm="4" class="py-0 px-3">
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
            <v-col cols="auto" class="px-3 my-3" align-self="center">
              <v-btn
                id="export-btn"
                color="primary"
                aria-label="export table"
                class="d-block montserrat"
              >
                {{ $t('common.export') }}
                <v-menu
                  activator="#export-btn"
                  transition="slide-y-transition"
                  offset-y
                  bottom
                  right
                >
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
              </v-btn>
            </v-col>
            <v-col>
              <pagination-controls
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
                @update:options="updateOptions"
              />
              <!-- <v-data-footer
                style="border: none"
                :pagination="pagination"
                :options="options"
                :show-first-last-page="footerProps.showFirstLastPage"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                @update:options="updateOptions"
              /> -->
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-if="!onlyTable" #footer="{ props }">
        <pagination-controls
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
import PaginationControls from '~/components/PaginationControls.vue'
export default {
  name: 'TableWrapper',
  components: { PaginationControls },
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
      this.isLoading = true
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 500),
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
