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
    stratigraphy: {
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
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            fq: `(stratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${this.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*))`,
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
