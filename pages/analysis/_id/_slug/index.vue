<template>
  <div>
    <data-table-analysis-result
      :items="analysisResults"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      hide-depth
      hide-method
      dynamic-headers
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import round from 'lodash/round'
import { ANALYSIS_RESULT, HEADERS_ANALYSIS_RESULT } from '~/constants'
import DataTableAnalysisResult from '~/components/data-table/DataTableAnalysisResult.vue'
export default {
  components: { DataTableAnalysisResult },
  data() {
    return {
      analysisResults: [],
      count: 0,
      options: ANALYSIS_RESULT.options,
      search: '',
    }
  },
  async fetch() {
    const analysisResultResponse =
      await this.$services.sarvSolr.getResourceList('analysis_results', {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `analysis_id:${this.$route.params.id}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_ANALYSIS_RESULT),
      })

    this.analysisResults = analysisResultResponse.items
    this.count = analysisResultResponse.count
  },
  methods: {
    round,
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
