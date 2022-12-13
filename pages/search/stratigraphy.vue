<template>
  <div>
    <data-table-stratigraphy
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
import { HEADERS_STRATIGRAPHY, STRATIGRAPHY } from '~/constants'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy.vue'

export default {
  components: { DataTableStratigraphy },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: STRATIGRAPHY.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'stratigraphy',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY),
        searchFilters: {},
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
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
