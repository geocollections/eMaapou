<template>
  <div>
    <data-table-analysis
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
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import { ANALYSIS, HEADERS_ANALYSIS } from '~/constants'

export default {
  components: { DataTableAnalysis },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: ANALYSIS,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_ANALYSIS),
        searchFilters: {},
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
