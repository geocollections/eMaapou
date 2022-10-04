<template>
  <data-table-sample
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
import DataTableSample from '~/components/data-table/DataTableSample.vue'
import { HEADERS_SAMPLE, SAMPLE } from '~/constants'

export default {
  components: { DataTableSample },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: SAMPLE.options,
      items: [],
      count: 0,
    }
  },
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 400),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_SAMPLE),
          searchFilters: {},
        }
      )
      this.items = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
