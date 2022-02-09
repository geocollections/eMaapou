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
import SampleTable from '~/components/tables/SampleTable'

import { HEADERS_SAMPLE, SAMPLE } from '~/constants'
export default {
  components: { SampleTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    depthStart: {
      type: Number,
      default: null,
    },
    depthEnd: {
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
            fq: `locality_id:${this.locality} AND (depth:[${this.depthStart} TO ${this.depthEnd}] OR depth_interval:[${this.depthStart} TO ${this.depthEnd}])`,
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
