<template>
  <rock-table
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
import { ROCK } from '~/constants'
import RockTable from '~/components/tables/RockTable'

export default {
  components: { RockTable },
  data() {
    return {
      options: ROCK.options,
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'rock',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(ROCK.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
