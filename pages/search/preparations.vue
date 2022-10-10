<template>
  <data-table-preparation
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
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
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 400),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const preparationResponse = await this.$services.sarvSolr.getResourceList(
        'preparation',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_PREPARATION),
          searchFilters: {},
        }
      )
      this.items = preparationResponse.items
      this.count = preparationResponse.count
    },
  },
}
</script>
