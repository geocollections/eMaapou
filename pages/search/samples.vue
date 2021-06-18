<template>
  <sample-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import SampleTable from '~/components/tables/SampleTable.vue'
import { SAMPLE } from '~/constants'

export default {
  components: { SampleTable },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: SAMPLE.options,
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
        'sample',
        {
          options: tableState.options,
          search: this.query,
          queryFields: this.$getQueryFields(SAMPLE.queryFields),
          searchFilters: {},
        }
      )
      this.items = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
