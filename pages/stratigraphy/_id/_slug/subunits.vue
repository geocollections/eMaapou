<template>
  <stratigraphy-table
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce, isNil } from 'lodash'
import { HEADERS_STRATIGRAPHY, STRATIGRAPHY } from '~/constants'
import StratigraphyTable from '~/components/tables/StratigraphyTable'

export default {
  components: { StratigraphyTable },
  data() {
    return {
      options: STRATIGRAPHY.options,
      items: [],
      count: 0,
    }
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
      this.options = tableState.options
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'stratigraphy',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `parent_id:${this.$route.params.id}`,
          },
          fields: this.$getFields(HEADERS_STRATIGRAPHY),
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
