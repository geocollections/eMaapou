<template>
  <analysis-result-table
    :items="analysisResults"
    :count="count"
    :options="options"
    hide-depth
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { HEADERS_ANALYSIS_RESULT } from '~/constants'
import AnalysisResultTable from '~/components/tables/AnalysisResultTable'
export default {
  components: { AnalysisResultTable },
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
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `sample_id:${this.$route.params.id}`,
          },
          fields: this.$getFields(HEADERS_ANALYSIS_RESULT),
        }
      )
      this.analysisResults = response.items
      this.count = response.count
    },
  },
}
</script>
