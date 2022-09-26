<template>
  <data-table-dataset-analysis
    :items="analyses"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableDatasetAnalysis from '~/components/data-table/DataTableDatasetAnalysis.vue'
import { DATASET_ANALYSIS, HEADERS_DATASET_ANALYSIS } from '~/constants'

export default {
  components: { DataTableDatasetAnalysis },
  data() {
    return {
      analyses: [],
      count: 0,
      options: DATASET_ANALYSIS.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analytical_data',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `dataset_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_DATASET_ANALYSIS),
        }
      )
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
