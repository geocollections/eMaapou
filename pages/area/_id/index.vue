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
import { SITE } from '~/constants'

export default {
  components: { SiteTable },
  props: {
    area: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      sites: [],
      count: 0,
      options: SITE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const solrResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          ...tableState,
          isValid: isNil(this.area),
          defaultParams: {
            fq: `area_id:${this.area}`,
          },
          queryFields: this.$getQueryFields(SITE.queryFields),
        }
      )

      this.options = tableState.options
      this.sites = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
