<template>
  <div>
    <data-table-area
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
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import { AREA, HEADERS_AREA } from '~/constants'

export default {
  components: { DataTableArea },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: AREA,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const areaResponse = await this.$services.sarvSolr.getResourceList('area', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_AREA),
      searchFilters: {},
    })
    this.items = areaResponse.items
    this.count = areaResponse.count
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
