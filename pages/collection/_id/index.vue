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
    collection: {
      type: Object,
      default: () => {},
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
    if (isNil(this.collection)) return

    const specimenResponse = await this.$services.sarvSolr.getResourceList(
      'specimen',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `collection_id:${this.collection.id}`,
          // fq: `stratigraphy_id:${this.stratigraphy}`,
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
