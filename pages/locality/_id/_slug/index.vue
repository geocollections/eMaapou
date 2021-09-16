<template>
  <locality-reference-table
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import LocalityReferenceTable from '~/components/tables/LocalityReferenceTable.vue'
import { LOCALITY_REFERENCE } from '~/constants'
export default {
  components: { LocalityReferenceTable },
  data() {
    return {
      references: [],
      count: 0,
      options: LOCALITY_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'locality_reference',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            locality: this.$route.params.id,
            nest: 1,
          },
          queryFields: this.$getQueryFields(LOCALITY_REFERENCE.queryFields),
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
