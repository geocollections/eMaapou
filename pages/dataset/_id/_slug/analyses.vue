<template>
  <div>
    <data-table-dataset-analysis
      :items="analyses"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableDatasetAnalysis from '~/components/data-table/DataTableDatasetAnalysis.vue'
import { DATASET_ANALYSIS, HEADERS_DATASET_ANALYSIS } from '~/constants'

export default {
  components: { DataTableDatasetAnalysis },
  data() {
    return {
      analyses: [],
      count: 0,
      options: DATASET_ANALYSIS.options,
      search: '',
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `dataset_ids:${this.$route.params.id}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_DATASET_ANALYSIS),
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
