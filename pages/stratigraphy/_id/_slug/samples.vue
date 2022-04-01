<template>
  <data-table-sample
    :items="samples"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSample from '~/components/data-table/DataTableSample.vue'

import { HEADERS_SAMPLE, SAMPLE } from '~/constants'
export default {
  components: { DataTableSample },
  props: {
    stratigraphy: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      samples: [],
      count: 0,
      options: SAMPLE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...tableState,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            // fq: `stratigraphy_id:${this.stratigraphy}`,
            fq: `(stratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${this.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*))`,
          },
          fields: this.$getAPIFieldValues(HEADERS_SAMPLE),
        }
      )
      this.samples = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
