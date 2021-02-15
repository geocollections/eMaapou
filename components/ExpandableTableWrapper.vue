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
    <template #top="{ pagination, updateOptions }">
      <v-text-field
        v-model="search"
        class="ma-4"
        append-icon="mdi-magnify"
        :label="$t('common.search')"
        single-line
        hide-details
        clearable
        @input="handleSearch"
      ></v-text-field>
      <v-data-footer
        style="border: none"
        :pagination="pagination"
        :options="options"
        :items-per-page-options="footerProps['items-per-page-options']"
        @update:options="updateOptions"
      />
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
    expandHeaderText: {
      type: String,
      default: '',
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
      headersLocal: [
        ...this.headers,
        {
          text: this.expandHeaderText,
          value: 'data-table-expand',
          align: 'center',
        },
      ],
      options: this.initOptions,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
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
