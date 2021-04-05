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
  props: {
    stratigraphy: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      specimens: [],
      count: 0,
      options: SPECIMEN.options,
    }
  },
  methods: {
    async handleUpdate(options) {
      const specimenResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            fq: `stratigraphy_id:${this.stratigraphy}`,
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
