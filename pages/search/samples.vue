<template>
  <div>
    <data-table-sample
      :show-search="false"
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
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
  async fetch() {
    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_SAMPLE),
        searchFilters: {},
      }
    )
    this.items = sampleResponse.items
    this.count = sampleResponse.count
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
