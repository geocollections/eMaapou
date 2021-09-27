<template>
  <site-table
    :items="sites"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SiteTable from '@/components/tables/SiteTable'
import { HEADERS_SITE, SITE } from '~/constants'

export default {
  components: { SiteTable },
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
          queryFields: this.$getSortValues(HEADERS_SITE),
        }
      )

      this.sites = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
