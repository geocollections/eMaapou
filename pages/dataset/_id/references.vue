<template>
  <div>
    <data-table-dataset-reference
      :items="references"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableDatasetReference from '~/components/data-table/DataTableDatasetReference.vue'
import { DATASET_REFERENCE, HEADERS_DATASET_REFERENCE } from '~/constants'
export default {
  components: { DataTableDatasetReference },
  data() {
    return {
      references: [],
      count: 0,
      options: DATASET_REFERENCE.options,
      search: '',
    }
  },
  async fetch() {
    const referenceResponse = await this.$services.sarvREST.getResourceList(
      'dataset_reference',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
