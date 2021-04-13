<template>
  <sample-table
    :items="samples"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import SampleTable from '@/components/tables/SampleTable'
import { isNil } from 'lodash'

import { SAMPLE } from '~/constants'
export default {
  components: { SampleTable },
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
      console.log(this.stratigraphy)
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...tableState,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            // fq: `stratigraphy_id:${this.stratigraphy}`,
            fq: `(stratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*)+OR+age_hierarchy:(${this.stratigraphy.hierarchy_string}*)+OR+lithostratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*))`,
          },
          queryFields: this.$getQueryFields(SAMPLE.queryFields),
        }
      )
      this.options = tableState.options
      this.samples = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
