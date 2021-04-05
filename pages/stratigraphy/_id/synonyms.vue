<template>
  <stratigraphy-synonym-table
    :items="synonyms"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import StratigraphySynonymTable from '~/components/tables/StratigraphySynonymTable.vue'
import { STRATIGRAPHY_SYNONYM } from '~/constants'
export default {
  components: { StratigraphySynonymTable },
  props: {
    stratigraphy: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      synonyms: [],
      count: 0,
      options: STRATIGRAPHY_SYNONYM.options,
    }
  },
  methods: {
    async handleUpdate(options) {
      const synonymResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_synonym',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            stratigraphy__id: this.stratigraphy,
          },
          queryFields: this.$getQueryFields(STRATIGRAPHY_SYNONYM.queryFields),
        }
      )
      this.synonyms = synonymResponse.items
      this.count = synonymResponse.count
    },
  },
}
</script>
