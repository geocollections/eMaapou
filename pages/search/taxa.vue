<template>
  <data-table-taxon
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    dynamic-headers
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import { HEADERS_TAXON, TAXON } from '~/constants'
import DataTableTaxon from '~/components/data-table/DataTableTaxon'

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
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'taxon',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_TAXON),
          searchFilters: {},
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
