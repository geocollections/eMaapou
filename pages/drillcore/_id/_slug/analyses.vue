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
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import { HEADERS_ANALYSIS } from '~/constants'

export default {
  components: { DataTableAnalysis },
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
      search: '',
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
    }
  },
  async fetch() {
    if (isNil(this.locality)) return
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `locality_id:${this.locality}`,
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
