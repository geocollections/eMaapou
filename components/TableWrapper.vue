<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
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
    <template v-for="(_, slotName) in $scopedSlots" #[slotName]="context">
      <slot :name="slotName" v-bind="context" />
    </template>
  </v-data-table>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'TableWrapper',
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
  },
  data() {
    return {
      search: '',
      options: this.initOptions,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
      },
    }
  },
  methods: {
    handleChange(options) {
      this.$emit('update', { ...options, search: this.search })
    },
    handleSearch: debounce(function () {
      if (this.options.page !== 1) this.options.page = 1
      else this.$emit('update', { ...this.options, search: this.search })
    }, 500),
  },
}
</script>
