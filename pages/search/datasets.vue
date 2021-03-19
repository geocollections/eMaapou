<template>
  <dataset-table
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
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(options) {
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'dataset',
        {
          tableOptions: options.tableOptions,
          search: this.search,
          queryFields: this.$getQueryFields(DATASET.queryFields),
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
