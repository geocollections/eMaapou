<template>
  <taxon-table
    :show-search="false"
    external-options
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
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(options) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'taxon',
        {
          tableOptions: options.tableOptions,
          search: this.search,
          queryFields: this.$getQueryFields(TAXON.queryFields),
          searchFilters: {},
        }
      )
      this.options = options.tableOptions
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
