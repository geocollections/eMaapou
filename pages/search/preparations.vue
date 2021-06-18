<template>
  <preparation-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import PreparationTable from '@/components/tables/PreparationTable'
import { debounce } from 'lodash'
import { PREPARATION } from '~/constants'

export default {
  components: { PreparationTable },
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
      }, 500),
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
          queryFields: this.$getQueryFields(PREPARATION.queryFields),
          searchFilters: {},
        }
      )
      this.items = preparationResponse.items
      this.count = preparationResponse.count
    },
  },
}
</script>
