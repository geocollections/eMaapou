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

import { HEADERS_SPECIMEN, SPECIMEN } from '~/constants'
export default {
  props: {
    collection: {
      type: Object,
      default: () => {},
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
          isValid: isNil(this.collection),
          defaultParams: {
            fq: `collection_id:${this.collection.id}`,
            // fq: `stratigraphy_id:${this.stratigraphy}`,
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
