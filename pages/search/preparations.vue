<template>
  <div>
    <data-table-preparation
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
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import { HEADERS_PREPARATION, PREPARATION } from '~/constants'

export default {
  components: { DataTablePreparation },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: PREPARATION.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_PREPARATION),
        searchFilters: {},
      }
    )
    this.items = preparationResponse.items
    this.count = preparationResponse.count
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
