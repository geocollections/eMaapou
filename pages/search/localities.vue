<template>
  <data-table-locality
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import { HEADERS_LOCALITY, LOCALITY } from '~/constants'

export default {
  components: { DataTableLocality },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: LOCALITY.options,
      items: [],
      count: 0,
    }
  },
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({
          options: { ...this.options },
          search: value,
        })
      }, 400),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const localityResponse = await this.$services.sarvSolr.getResourceList(
        'locality',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_LOCALITY),
          searchFilters: {},
        }
      )
      this.items = localityResponse.items
      this.count = localityResponse.count
    },
  },
}
</script>
