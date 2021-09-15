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
    locality: {
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const sampleResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
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
