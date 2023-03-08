<template>
  <div>
    <data-table-specimen-reference
      :items="references"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableSpecimenReference from '~/components/data-table/DataTableSpecimenReference.vue'
import { HEADERS_SPECIMEN_REFERENCE, SPECIMEN_REFERENCE } from '~/constants'
export default {
  components: { DataTableSpecimenReference },
  data() {
    return {
      references: [],
      count: 0,
      options: SPECIMEN_REFERENCE.options,
      search: '',
    }
  },
  async fetch() {
    const referenceResponse = await this.$services.sarvREST.getResourceList(
      'specimen_reference',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          specimen: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_SPECIMEN_REFERENCE),
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
