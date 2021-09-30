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
import { HEADERS_LOCALITY_REFERENCE, LOCALITY_REFERENCE } from '~/constants'
export default {
  components: { LocalityReferenceTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
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
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_LOCALITY_REFERENCE),
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
