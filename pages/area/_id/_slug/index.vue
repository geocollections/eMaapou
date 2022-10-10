<template>
  <data-table-site
    :items="sites"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import { HEADERS_SITE, SITE } from '~/constants'

export default {
  components: { DataTableSite },
  data() {
    return {
      sites: [],
      count: 0,
      options: SITE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const solrResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `area_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_SITE),
        }
      )

      this.sites = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
