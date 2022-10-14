<template>
  <div>
    <data-table-reference
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
import { HEADERS_REFERENCE, REFERENCE } from '~/constants'
import DataTableReference from '~/components/data-table/DataTableReference.vue'

export default {
  components: { DataTableReference },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: REFERENCE.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'reference',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_REFERENCE),
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
