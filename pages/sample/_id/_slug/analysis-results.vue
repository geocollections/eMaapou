<template>
  <div>
    <data-table-sample-analysis-result
      :items="analysisResults"
      :count="count"
      :options="options"
      hide-depth
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { HEADERS_ANALYSIS_RESULT } from '~/constants'
import DataTableSampleAnalysisResult from '~/components/data-table/DataTableSampleAnalysisResult.vue'
export default {
  components: { DataTableSampleAnalysisResult },
  data() {
    return {
      analysisResults: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      search: '',
    }
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'analysis_results',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `sample_id:${this.$route.params.id}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_ANALYSIS_RESULT),
      }
    )
    this.analysisResults = response.items
    this.count = response.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
