<template>
  <stratigraphy-reference-table
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce, isNil } from 'lodash'
import { STRATIGRAPHY_REFERENCE } from '~/constants'
import StratigraphyReferenceTable from '~/components/tables/StratigraphyReferenceTable'

export default {
  components: { StratigraphyReferenceTable },
  props: {
    stratigraphy: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      options: STRATIGRAPHY_REFERENCE.options,
      items: [],
      count: 0,
    }
  },
  watch: {
    search: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_reference',
        {
          ...tableState,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            stratigraphy: this.stratigraphy,
          },
          queryFields: this.$getQueryFields(STRATIGRAPHY_REFERENCE.queryFields),
        }
      )

      this.items = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
