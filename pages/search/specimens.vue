<template>
  <data-table-specimen
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
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
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 400),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
          searchFilters: {},
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
