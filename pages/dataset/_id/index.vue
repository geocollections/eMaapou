<template>
  <dataset-analysis-table
    :items="analyses"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DatasetAnalysisTable from '@/components/tables/DatasetAnalysisTable'
import { DATASET_ANALYSIS } from '~/constants'

export default {
  components: { DatasetAnalysisTable },
  props: {
    dataset: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      analyses: [],
      count: 0,
      options: DATASET_ANALYSIS.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analytical_data',
        {
          ...tableState,
          isValid: isNil(this.dataset),
          defaultParams: {
            fq: `dataset_id:${this.dataset}`,
          },
          queryFields: this.$getQueryFields(DATASET_ANALYSIS.queryFields),
        }
      )
      this.options = tableState.options
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
