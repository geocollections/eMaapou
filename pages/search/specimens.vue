<template>
  <specimen-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import { SPECIMEN } from '~/constants'
import SpecimenTable from '~/components/tables/SpecimenTable'

export default {
  components: { SpecimenTable },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: SPECIMEN.options,
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
      const analysisResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          options: tableState.options,
          search: this.query,
          queryFields: this.$getQueryFields(SPECIMEN.queryFields),
          searchFilters: {},
        }
      )
      this.items = analysisResponse.items
      this.count = analysisResponse.count
    },
  },
}
</script>
