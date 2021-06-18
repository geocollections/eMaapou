<template>
  <locality-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import LocalityTable from '~/components/tables/LocalityTable.vue'
import { LOCALITY } from '~/constants'

export default {
  components: { LocalityTable },
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
      }, 500),
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
          queryFields: this.$getQueryFields(LOCALITY.queryFields),
          searchFilters: {},
        }
      )
      this.items = localityResponse.items
      this.count = localityResponse.count
    },
  },
}
</script>
