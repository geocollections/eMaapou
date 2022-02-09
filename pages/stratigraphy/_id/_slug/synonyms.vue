<template>
  <data-table-stratigraphy-synonym
    :items="synonyms"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DataTableStratigraphySynonym from '~/components/data-table/DataTableStratigraphySynonym.vue'
import { HEADERS_STRATIGRAPHY_SYNONYM, STRATIGRAPHY_SYNONYM } from '~/constants'
export default {
  components: { DataTableStratigraphySynonym },
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const synonymResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_synonym',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            stratigraphy: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY_SYNONYM),
        }
      )
      this.synonyms = synonymResponse.items
      this.count = synonymResponse.count
    },
  },
}
</script>
