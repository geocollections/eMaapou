<template>
  <sample-reference-table
    :items="references"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SampleReferenceTable from '@/components/tables/SampleReferenceTable'
import { SAMPLE_REFERENCE } from '~/constants'
export default {
  components: { SampleReferenceTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      references: [],
      count: 0,
      options: SAMPLE_REFERENCE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'sample_reference',
        {
          ...tableState,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
          },
          queryFields: this.$getQueryFields(SAMPLE_REFERENCE.queryFields),
        }
      )
      this.options = tableState.options
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
