<template>
  <locality-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import LocalityTable from '~/components/tables/LocalityTable.vue'
import { LOCALITY } from '~/constants'

export default {
  components: { LocalityTable },
  data() {
    return {
      options: LOCALITY.options,
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
        this.handleUpdate({
          options: { ...this.options },
          search: value,
        })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      const localityResponse = await this.$services.sarvSolr.getResourceList(
        'locality',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(LOCALITY.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = localityResponse.items
      this.count = localityResponse.count
    },
  },
}
</script>
