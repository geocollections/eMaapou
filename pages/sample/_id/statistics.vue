<template>
  <analytical-data-table
    :items="analyticalData"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { ANALYTICAL_DATA } from '~/constants'
import AnalyticalDataTable from '~/components/tables/AnalyticalDataTable'
export default {
  components: { AnalyticalDataTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      analyticalData: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const response = await this.$services.sarvSolr.getResourceList(
        'analytical_data',
        {
          ...tableState,
          isValid: isNil(this.sample),
          defaultParams: {
            fq: `sample_id:${this.sample}`,
          },
          queryFields: this.$getQueryFields(ANALYTICAL_DATA.queryFields),
        }
      )
      this.options = tableState.options
      this.analyticalData = response.items
      this.count = response.count
    },
  },
}
</script>
