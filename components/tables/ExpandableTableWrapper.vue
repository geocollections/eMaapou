<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    show-expand
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    :headers="headersLocal"
    :items="items"
    :options.sync="options"
    :server-items-length="count"
    :footer-props="footerProps"
    mobile-breakpoint="0"
    @update:options="handleChange"
  >
    <template #no-data>{{ $t('table.noData') }}</template>
    <template #top="{ pagination, updateOptions }">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4" class="py-0">
            <v-text-field
              v-model="search"
              color="deep-orange darken-2"
              append-icon="mdi-magnify"
              :label="$t('common.search')"
              hide-details
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col class="pa-0">
            <v-data-footer
              style="border: none"
              :pagination="pagination"
              :options="options"
              :items-per-page-options="footerProps['items-per-page-options']"
              :items-per-page-text="footerProps['items-per-page-text']"
              @update:options="updateOptions"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #item.data-table-expand="{ expand, isExpanded, item }">
      <v-btn
        v-if="item[expandField]"
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
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'ExpandableTableWrapper',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    initOptions: {
      type: Object,
      default: () => {},
    },
    count: {
      type: Number,
      default: 0,
    },
    singleExpand: {
      type: Boolean,
      default: false,
    },
    expandField: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      search: '',
      expanded: [],
      headersLocal: [...this.headers],
      options: this.initOptions,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
    }
  },
  methods: {
    handleChange(options) {
      this.$emit('update', { tableOptions: options, search: this.search })
    },
    handleSearch: debounce(function () {
      if (this.options.page !== 1) this.options.page = 1
      else
        this.$emit('update', {
          tableOptions: this.options,
          search: this.search,
        })
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
.v-btn.active .v-icon {
  transform: rotate(-180deg);
}
</style>
