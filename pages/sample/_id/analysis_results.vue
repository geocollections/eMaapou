<template>
  <analysis-result-table
    :items="analysisResults"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { ANALYSIS_RESULT } from '~/constants'
import AnalysisResultTable from '~/components/tables/AnalysisResultTable'
export default {
  components: { AnalysisResultTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
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
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const response = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          ...tableState,
          isValid: isNil(this.sample),
          defaultParams: {
            fq: `sample_id:${this.sample}`,
          },
          queryFields: this.$getQueryFields(ANALYSIS_RESULT.queryFields),
        }
      )
      this.analysisResults = response.items
      this.count = response.count
    },
  },
}
</script>
