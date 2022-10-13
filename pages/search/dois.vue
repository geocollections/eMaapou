<template>
  <div>
    <data-table-doi
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
import { DOI, HEADERS_DOI } from '~/constants'
import DataTableDoi from '~/components/data-table/DataTableDoi.vue'

export default {
  components: { DataTableDoi },
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
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('doi', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_DOI),
      searchFilters: {},
    })
    this.items = response.items
    this.count = response.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
