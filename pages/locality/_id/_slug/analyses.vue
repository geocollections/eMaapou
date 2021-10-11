<template>
  <analysis-table
    :items="analyses"
    :count="count"
    :options="options"
    hide-locality
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { HEADERS_ANALYSIS } from '~/constants'
import AnalysisTable from '~/components/tables/AnalysisTable'
export default {
  components: { AnalysisTable },
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
      this.options = tableState.options
      const response = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `locality_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_ANALYSIS),
        }
      )
      this.analyses = response.items
      this.count = response.count
    },
  },
}
</script>
