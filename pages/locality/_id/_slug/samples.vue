<template>
  <sample-table
    :items="samples"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SampleTable from '@/components/tables/SampleTable'

import { HEADERS_SAMPLE, SAMPLE } from '~/constants'

export default {
  components: { SampleTable },
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
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `locality_id:${this.$route.params.id}`,
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
