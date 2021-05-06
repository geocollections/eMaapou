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
import { ANALYSIS } from '~/constants'
import AnalysisTable from '~/components/tables/AnalysisTable'
export default {
  components: { AnalysisTable },
  props: {
    locality: {
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
      const response = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
          },
          queryFields: this.$getQueryFields(ANALYSIS.queryFields),
        }
      )
      this.options = tableState.options
      this.analyses = response.items
      this.count = response.count
    },
  },
}
</script>
