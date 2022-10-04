<template>
  <data-table-stratigraphy
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
import { HEADERS_STRATIGRAPHY, STRATIGRAPHY } from '~/constants'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy'

export default {
  components: { DataTableStratigraphy },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: STRATIGRAPHY.options,
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
        'stratigraphy',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY),
          searchFilters: {},
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
