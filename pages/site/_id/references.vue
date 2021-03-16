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
  props: {
    site: {
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
    async handleUpdate(options) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'locality_reference',
        {
          ...options,
          isValid: isNil(this.site),
          defaultParams: {
            site: this.site,
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
