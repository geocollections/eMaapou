<template>
  <analysis-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import AnalysisTable from '@/components/tables/AnalysisTable'
import { debounce } from 'lodash'
import { mapState } from 'vuex'
import { ANALYSIS } from '~/constants'

export default {
  components: { AnalysisTable },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: ANALYSIS.options,
      items: [],
      count: 0,
    }
  },
  computed: {
    ...mapState('search', { search: 'searchQuery' }),
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'analysis',
        {
          options: tableState.options,
          search: this.query,
          queryFields: this.$getQueryFields(ANALYSIS.queryFields),
          searchFilters: {},
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
