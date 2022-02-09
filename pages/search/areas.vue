<template>
  <data-table-area
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import DataTableArea from '~/components/data-table/DataTableArea'
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
      const areaResponse = await this.$services.sarvSolr.getResourceList(
        'area',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_AREA),
          searchFilters: {},
        }
      )
      this.items = areaResponse.items
      this.count = areaResponse.count
    },
  },
}
</script>
