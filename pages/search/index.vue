<template>
  <drillcore-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import DrillcoreTable from '~/components/tables/DrillcoreTable.vue'
import { DRILLCORE } from '~/constants'
export default {
  components: { DrillcoreTable },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: DRILLCORE.options,
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
      const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
        'drillcore',
        {
          options: tableState.options,
          search: this.query,
          queryFields: this.$getQueryFields(DRILLCORE.queryFields),
          searchFilters: {},
        }
      )
      this.items = drillcoreResponse.items
      this.count = drillcoreResponse.count
    },
  },
}
</script>
