<template>
  <specimen-reference-table
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SpecimenReferenceTable from '~/components/tables/SpecimenReferenceTable.vue'
import { SPECIMEN_REFERENCE } from '~/constants'
export default {
  components: { SpecimenReferenceTable },
  data() {
    return {
      references: [],
      count: 0,
      options: SPECIMEN_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'specimen_reference',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            specimen: this.$route.params.id,
            nest: 1,
          },
          queryFields: this.$getQueryFields(SPECIMEN_REFERENCE.queryFields),
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
