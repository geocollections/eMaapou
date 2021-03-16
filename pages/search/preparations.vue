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
      handler(value) {
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      },
    },
  },
  methods: {
    async handleUpdate(options) {
      const preparationResponse = await this.$services.sarvSolr.getResourceList(
        'preparation',
        {
          tableOptions: options.tableOptions,
          search: this.search,
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
