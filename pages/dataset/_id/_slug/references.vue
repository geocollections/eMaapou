<template>
  <data-table-dataset-reference
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableDatasetReference from '~/components/data-table/DataTableDatasetReference.vue'
import { DATASET_REFERENCE, HEADERS_DATASET_REFERENCE } from '~/constants'
export default {
  components: { DataTableDatasetReference },
  data() {
    return {
      references: [],
      count: 0,
      options: DATASET_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'dataset_reference',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            dataset: this.$route.params.id,
            nest: 2,
          },
          fields: this.$getAPIFieldValues(HEADERS_DATASET_REFERENCE),
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
