<template>
  <doi-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import { DOI } from '~/constants'
import DoiTable from '~/components/tables/DoiTable'

export default {
  components: { DoiTable },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: DOI.options,
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
      const response = await this.$services.sarvSolr.getResourceList('doi', {
        options: tableState.options,
        search: this.query,
        queryFields: this.$getQueryFields(DOI.queryFields),
        searchFilters: {},
      })
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
