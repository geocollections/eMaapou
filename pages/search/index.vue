<template>
  <div>
    <data-table-drillcore
      :show-search="false"
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableDrillcore from '~/components/data-table/DataTableDrillcore.vue'
import { DRILLCORE, HEADERS_DRILLCORE } from '~/constants'
export default {
  components: { DataTableDrillcore },
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
  async fetch() {
    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_DRILLCORE),
        searchFilters: {},
      }
    )
    this.items = drillcoreResponse.items
    this.count = drillcoreResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
