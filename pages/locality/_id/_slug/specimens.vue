<template>
  <specimen-table
    :items="specimens"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import SpecimenTable from '@/components/tables/SpecimenTable'
import { isNil } from 'lodash'

import { SPECIMEN } from '~/constants'
export default {
  components: { SpecimenTable },
  data() {
    return {
      specimens: [],
      count: 0,
      options: SPECIMEN.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const specimenResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `locality_id:${this.$route.params.id}`,
          },
          queryFields: this.$getQueryFields(SPECIMEN.queryFields),
        }
      )
      this.specimens = specimenResponse.items
      this.count = specimenResponse.count
    },
  },
}
</script>
