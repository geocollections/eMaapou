<template>
  <div>
    <data-table-sample
      :items="samples"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSample from '~/components/data-table/DataTableSample.vue'

import { HEADERS_SAMPLE, SAMPLE } from '~/constants'
export default {
  components: { DataTableSample },
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
      search: '',
    }
  },
  async fetch() {
    if (isNil(this.locality)) return
    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `locality_id:${this.locality} AND (depth:[${this.depthStart} TO ${this.depthEnd}] OR depth_interval:[${this.depthStart} TO ${this.depthEnd}])`,
        },
        fields: this.$getAPIFieldValues(HEADERS_SAMPLE),
      }
    )
    this.samples = sampleResponse.items
    this.count = sampleResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
