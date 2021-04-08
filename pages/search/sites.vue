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
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { SITE } from '~/constants'
import SiteTable from '~/components/tables/SiteTable.vue'

export default {
  components: { SiteTable },
  data() {
    return {
      options: SITE.options,
      items: [],
      count: 0,
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  watch: {
    search: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'site',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(SITE.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
