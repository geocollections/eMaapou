<template>
  <taxon-table
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
import { TAXON } from '~/constants'
import TaxonTable from '~/components/tables/TaxonTable'

export default {
  components: { TaxonTable },
  data() {
    return {
      options: TAXON.options,
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'taxon',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(TAXON.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
