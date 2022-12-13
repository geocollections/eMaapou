<template>
  <div>
    <data-table-locality
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
  async fetch() {
    const localityResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_LOCALITY),
        searchFilters: {},
      }
    )
    this.items = localityResponse.items
    this.count = localityResponse.count
  },
  watch: {
    '$route.query': function (newQuery, oldQuery) {
      if (
        !this._inactive &&
        JSON.stringify(newQuery) !== JSON.stringify(oldQuery)
      ) {
        this.$fetch()
      }
    },
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
