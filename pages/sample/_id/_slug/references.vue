<template>
  <data-table-sample-reference
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSampleReference from '~/components/data-table/DataTableSampleReference.vue'
import { HEADERS_SAMPLE_REFERENCE, SAMPLE_REFERENCE } from '~/constants'
export default {
  components: { DataTableSampleReference },
  data() {
    return {
      references: [],
      count: 0,
      options: SAMPLE_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'sample_reference',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
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
  },
}
</script>
