<template>
  <dataset-analysis-table
    :items="analyses"
    :count="count"
    :options="options"
    :additional-headers="parameters"
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
    parameters: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      analyses: [],
      count: 0,
      options: DATASET_ANALYSIS.options,
    }
  },
  computed: {
    mergedQueryFields() {
      const parameterQueryFields = this.parameters.reduce(
        (obj, item) => ({ ...obj, [item.value]: item.value }),
        {}
      )
      return {
        ...this.$getQueryFields(DATASET_ANALYSIS.queryFields),
        ...parameterQueryFields,
      }
    },
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
          queryFields: this.mergedQueryFields,
        }
      )
      this.options = tableState.options
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
