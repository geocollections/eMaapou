<template>
  <dataset-reference-table
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DatasetReferenceTable from '~/components/tables/DatasetReferenceTable.vue'
import { DATASET_REFERENCE } from '~/constants'
export default {
  components: { DatasetReferenceTable },
  props: {
    dataset: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      references: [],
      count: 0,
      options: DATASET_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'dataset_reference',
        {
          ...tableState,
          isValid: isNil(this.dataset),
          defaultParams: {
            dataset: this.dataset,
          },
          queryFields: this.$getQueryFields(DATASET_REFERENCE.queryFields),
        }
      )
      this.options = tableState.options
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
