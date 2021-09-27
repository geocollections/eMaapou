<template>
  <site-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import { HEADERS_SITE, SITE } from '~/constants'
import SiteTable from '~/components/tables/SiteTable.vue'

export default {
  components: { SiteTable },
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
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          options: tableState.options,
          search: this.query,
          queryFields: this.$getSortValues(HEADERS_SITE),
          searchFilters: {},
        }
      )
      this.items = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
