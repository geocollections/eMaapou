<template>
  <sample-table
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
import SampleTable from '~/components/tables/SampleTable.vue'
import { SAMPLE } from '~/constants'

export default {
  components: { SampleTable },
  data() {
    return {
      options: SAMPLE.options,
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
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          tableOptions: options.tableOptions,
          search: this.search,
          queryFields: this.$getQueryFields(SAMPLE.queryFields),
          searchFilters: {},
        }
      )
      this.options = options.tableOptions
      this.items = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
