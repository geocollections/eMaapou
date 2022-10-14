<template>
  <div>
    <data-table-rock
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
import { HEADERS_ROCK, ROCK } from '~/constants'
import DataTableRock from '~/components/data-table/DataTableRock.vue'

export default {
  components: { DataTableRock },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: ROCK.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'rock',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_ROCK),
        searchFilters: {},
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
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
