<template>
  <data-table-specimen
    :items="specimens"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'

import { HEADERS_SPECIMEN, SPECIMEN } from '~/constants'
export default {
  components: { DataTableSpecimen },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      specimens: [],
      count: 0,
      options: SPECIMEN.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const specimenResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
        }
      )
      this.specimens = specimenResponse.items
      this.count = specimenResponse.count
    },
  },
}
</script>
