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
import DatasetAnalysisTable from '~/components/tables/DatasetAnalysisTable'
import { DATASET_ANALYSIS, HEADERS_DATASET_ANALYSIS } from '~/constants'

export default {
  components: { DatasetAnalysisTable },
  props: {
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
    mergedFields() {
      const parameterFields = this.parameters.reduce(
        (obj, item) => ({ ...obj, [item.value]: item.value }),
        {}
      )
      return {
        ...this.$getAPIFieldValues(HEADERS_DATASET_ANALYSIS),
        ...parameterFields,
      }
    },
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
          fields: this.mergedFields,
        }
      )
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
