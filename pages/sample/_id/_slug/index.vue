<template>
  <data-table-analysis
    :items="analyses"
    :count="count"
    :options="options"
    hide-depth
    hide-sample
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import { HEADERS_ANALYSIS } from '~/constants'
export default {
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `sample_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_ANALYSIS),
        }
      )
      this.analyses = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
