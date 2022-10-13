<template>
  <div>
    <data-table-specimen
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
import { HEADERS_SPECIMEN, SPECIMEN } from '~/constants'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'

export default {
  components: { DataTableSpecimen },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: SPECIMEN.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'specimen',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
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
