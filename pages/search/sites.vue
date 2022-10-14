<template>
  <div>
    <data-table-site
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
import { HEADERS_SITE, SITE } from '~/constants'
import DataTableSite from '~/components/data-table/DataTableSite.vue'

export default {
  components: { DataTableSite },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: SITE.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'site',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_SITE),
        searchFilters: {},
      }
    )
    this.items = sampleResponse.items
    this.count = sampleResponse.count
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
