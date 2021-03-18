<template>
  <drillcore-table
    :show-search="false"
    external-options
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
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
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      }, 500),
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
      this.options = options.tableOptions
      this.items = drillcoreResponse.items
      this.count = drillcoreResponse.count
    },
  },
}
</script>
