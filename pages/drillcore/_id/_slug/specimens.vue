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
      required: true,
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
    const specimenResponse = await this.$services.sarvSolr.getResourceList(
      'specimen',
      {
        search: this.search,
        options: this.options,
        isValid: isNil(this.locality),
        defaultParams: {
          fq: `locality_id:${this.locality}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
      }
    )
    console.log(specimenResponse, {
      search: this.search,
      options: this.options,
      isValid: isNil(this.locality),
      defaultParams: {
        fq: `locality_id:${this.locality}`,
      },
      fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
    })
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
