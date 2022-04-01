<template>
  <data-table-stratigraphy-reference
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
import isNil from 'lodash/isNil'
import {
  HEADERS_STRATIGRAPHY_REFERENCE,
  STRATIGRAPHY_REFERENCE,
} from '~/constants'
import DataTableStratigraphyReference from '~/components/data-table/DataTableStratigraphyReference'

export default {
  components: { DataTableStratigraphyReference },
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
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            stratigraphy: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY_REFERENCE),
        }
      )

      this.items = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
