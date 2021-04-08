<template>
  <dataset-table
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
import { DATASET } from '~/constants'
import DatasetTable from '~/components/tables/DatasetTable'

export default {
  components: { DatasetTable },
  data() {
    return {
      options: DATASET.options,
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
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'dataset',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(DATASET.queryFields),
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
