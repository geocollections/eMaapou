<template>
  <drillcore-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import DrillcoreTable from '~/components/tables/DrillcoreTable.vue'
import { DRILLCORE } from '~/constants'
export default {
  components: { DrillcoreTable },
  data() {
    return {
      options: DRILLCORE.options,
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
      const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
        'drillcore',
        {
          tableOptions: options.tableOptions,
          search: this.search,
          queryFields: this.$getQueryFields(DRILLCORE.queryFields),
          searchFilters: {},
        }
      )
      this.items = drillcoreResponse.items
      this.count = drillcoreResponse.count
    },
  },
}
</script>
