<template>
  <reference-table
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
import { REFERENCE } from '~/constants'
import ReferenceTable from '~/components/tables/ReferenceTable'

export default {
  components: { ReferenceTable },
  data() {
    return {
      options: REFERENCE.options,
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
      this.options = tableState.options
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'reference',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(REFERENCE.queryFields),
          searchFilters: {},
        }
      )

      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
