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
  data() {
    return {
      samples: [],
      count: 0,
      options: SAMPLE.options,
      search: '',
    }
  },
  async fetch() {
    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        search: this.search,
        options: this.options,
        isValid: isNil(this.$route.params.id),
        defaultParams: {
          fq: `site_id:${this.$route.params.id}`,
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
