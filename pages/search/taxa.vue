<template>
  <div>
    <data-table-taxon
      :show-search="false"
      :items="items"
      :count="count"
      :options="options"
      dynamic-headers
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { HEADERS_TAXON, TAXON } from '~/constants'
import DataTableTaxon from '~/components/data-table/DataTableTaxon.vue'

export default {
  components: { DataTableTaxon },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: TAXON.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'taxon',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_TAXON),
        searchFilters: {},
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
