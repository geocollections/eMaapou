<template>
  <div>
    <data-table-analysis
      :items="analyses"
      :count="count"
      :options="options"
      hide-locality
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import { HEADERS_ANALYSIS } from '~/constants'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
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
    const response = await this.$services.sarvSolr.getResourceList('analysis', {
      search: this.search,
      options: this.options,
      isValid: isNil(this.$route.params.id),
      defaultParams: {
        fq: `locality_id:${this.$route.params.id}`,
      },
      fields: this.$getAPIFieldValues(HEADERS_ANALYSIS),
    })
    this.analyses = response.items
    this.count = response.count
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
