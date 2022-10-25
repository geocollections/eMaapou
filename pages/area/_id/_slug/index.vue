<template>
  <div>
    <data-table-site
      :items="sites"
      :count="count"
      :is-loading="$fetchState.pending"
      :options="options"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import { HEADERS_SITE, SITE } from '~/constants'

export default {
  components: { DataTableSite },
  data() {
    return {
      sites: [],
      count: 0,
      options: SITE.options,
      search: '',
    }
  },
  async fetch() {
    const solrResponse = await this.$services.sarvSolr.getResourceList('site', {
      search: this.search,
      options: this.options,
      defaultParams: {
        fq: `area_id:${this.$route.params.id}`,
      },
      fields: this.$getAPIFieldValues(HEADERS_SITE),
    })

    this.sites = solrResponse.items
    this.count = solrResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
