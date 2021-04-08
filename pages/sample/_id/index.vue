<template>
  <analysis-table
    :items="analyses"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import AnalysisTable from '@/components/tables/AnalysisTable'
import { ANALYSIS } from '~/constants'
export default {
  components: { AnalysisTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      analyses: [],
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...tableState,
          isValid: isNil(this.sample),
          defaultParams: {
            fq: `sample_id:${this.sample}`,
          },
          queryFields: this.$getQueryFields(ANALYSIS.queryFields),
        }
      )
      this.options = tableState.options
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
