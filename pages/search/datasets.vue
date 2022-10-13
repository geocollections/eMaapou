<template>
  <div>
    <data-table-dataset
      :show-search="false"
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { DATASET, HEADERS_DATASET } from '~/constants'
import DataTableDataset from '~/components/data-table/DataTableDataset.vue'

export default {
  components: { DataTableDataset },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: DATASET.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'dataset',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_DATASET),
        searchFilters: {},
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
