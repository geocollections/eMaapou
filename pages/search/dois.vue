<template>
  <doi-table
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
import { DOI } from '~/constants'
import DoiTable from '~/components/tables/DoiTable'

export default {
  components: { DoiTable },
  data() {
    return {
      options: DOI.options,
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
      const response = await this.$services.sarvSolr.getResourceList('doi', {
        tableOptions: options.tableOptions,
        search: this.search,
        queryFields: this.$getQueryFields(DOI.queryFields),
        searchFilters: {},
      })
      this.options = options.tableOptions
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
