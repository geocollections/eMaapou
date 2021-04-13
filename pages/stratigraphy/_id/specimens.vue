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
      type: Object,
      default: () => {},
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
    async handleUpdate(tableState) {
      const specimenResponse = await this.$services.sarvSolr.getResourceList(
        'specimen',
        {
          ...tableState,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            fq: `(stratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*)+OR+age_hierarchy:(${this.stratigraphy.hierarchy_string}*)+OR+lithostratigraphy_hierarchy:(${this.stratigraphy.hierarchy_string}*))`,
            // fq: `stratigraphy_id:${this.stratigraphy}`,
          },
          queryFields: this.$getQueryFields(SPECIMEN.queryFields),
        }
      )
      this.options = tableState.options
      this.specimens = specimenResponse.items
      this.count = specimenResponse.count
    },
  },
}
</script>
