<template>
  <div>
    <data-table-analysis
      :items="analyses"
      :count="count"
      :options="options"
      hide-depth
      hide-sample
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import { HEADERS_ANALYSIS } from '~/constants'
export default {
  components: { DataTableAnalysis },
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
      search: '',
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
