<template>
  <data-table-analysis-result
    :items="analysisResults"
    :count="count"
    :options="options"
    hide-depth
    hide-method
    dynamic-headers
    @update="handleUpdate"
  />
</template>

<script>
import round from 'lodash/round'
import isNil from 'lodash/isNil'
import { ANALYSIS_RESULT, HEADERS_ANALYSIS_RESULT } from '~/constants'
import DataTableAnalysisResult from '~/components/data-table/DataTableAnalysisResult.vue'
export default {
  components: { DataTableAnalysisResult },
  data() {
    return {
      analysisResults: [],
      count: 0,
      options: ANALYSIS_RESULT.options,
    }
  },
  methods: {
    round,
    async handleUpdate(tableState) {
      this.options = tableState.options
      const analysisResultResponse =
        await this.$services.sarvSolr.getResourceList('analysis_results', {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `analysis_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_ANALYSIS_RESULT),
        })

      this.analysisResults = analysisResultResponse.items
      this.count = analysisResultResponse.count
    },
  },
}
</script>
