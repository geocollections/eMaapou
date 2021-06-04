<template>
  <analysis-result-table
    :items="analysisResults"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { round, isNil } from 'lodash'
import { ANALYSIS_RESULT } from '~/constants'
import AnalysisResultTable from '~/components/tables/AnalysisResultTable.vue'
export default {
  components: { AnalysisResultTable },
  props: {
    analysis: {
      type: Number,
      default: null,
    },
  },
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
      const analysisResultResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          ...tableState,
          isValid: isNil(this.analysis),
          defaultParams: {
            fq: `analysis_id:${this.analysis}`,
          },
          queryFields: this.$getQueryFields(ANALYSIS_RESULT.queryFields),
        }
      )

      this.analysisResults = analysisResultResponse.items
      this.count = analysisResultResponse.count
    },
  },
}
</script>
