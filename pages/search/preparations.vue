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
import { mapState } from 'vuex'
import PreparationTable from '@/components/tables/PreparationTable'
import { debounce } from 'lodash'
import { PREPARATION } from '~/constants'

export default {
  components: { PreparationTable },
  data() {
    return {
      options: PREPARATION.options,
      items: [],
      count: 0,
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  watch: {
    search: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      const preparationResponse = await this.$services.sarvSolr.getResourceList(
        'preparation',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(PREPARATION.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = preparationResponse.items
      this.count = preparationResponse.count
    },
  },
}
</script>
