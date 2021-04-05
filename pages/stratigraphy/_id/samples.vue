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
      type: Number,
      default: null,
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
    async handleUpdate(options) {
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            fq: `stratigraphy_id:${this.stratigraphy}`,
          },
          queryFields: this.$getQueryFields(SAMPLE.queryFields),
        }
      )
      this.samples = sampleResponse.items
      this.count = sampleResponse.count
    },
  },
}
</script>
