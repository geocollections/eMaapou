<template>
  <data-table-locality-reference
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DataTableLocalityReference from '~/components/data-table/DataTableLocalityReference.vue'
import { HEADERS_LOCALITY_REFERENCE, LOCALITY_REFERENCE } from '~/constants'
export default {
  components: { DataTableLocalityReference },
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
