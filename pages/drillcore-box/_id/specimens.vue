<template>
  <div>
    <data-table-specimen
      :items="specimens"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'

import { HEADERS_SPECIMEN, SPECIMEN } from '~/constants'
export default {
  components: { DataTableSpecimen },
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
      specimens: [],
      count: 0,
      options: SPECIMEN.options,
      search: '',
    }
  },
  async fetch() {
    if (isNil(this.locality)) return
    const specimenResponse = await this.$services.sarvSolr.getResourceList(
      'specimen',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `locality_id:${this.locality} AND (depth:[${this.depthStart} TO ${this.depthEnd}] OR depth_interval:[${this.depthStart} TO ${this.depthEnd}])`,
        },
        fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
      }
    )
    this.specimens = specimenResponse.items
    this.count = specimenResponse.count
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
