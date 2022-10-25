<template>
  <div>
    <data-table-sample-reference
      :items="references"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableSampleReference from '~/components/data-table/DataTableSampleReference.vue'
import { HEADERS_SAMPLE_REFERENCE, SAMPLE_REFERENCE } from '~/constants'
export default {
  components: { DataTableSampleReference },
  data() {
    return {
      references: [],
      count: 0,
      options: SAMPLE_REFERENCE.options,
      search: '',
    }
  },
  async fetch() {
    const referenceResponse = await this.$services.sarvREST.getResourceList(
      'sample_reference',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          sample: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_SAMPLE_REFERENCE),
      }
    )
    this.references = referenceResponse.items
    this.count = referenceResponse.count
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
