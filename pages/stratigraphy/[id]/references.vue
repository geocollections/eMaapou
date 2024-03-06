<template>
  <div>
    <data-table-stratigraphy-reference
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import {
  HEADERS_STRATIGRAPHY_REFERENCE,
  STRATIGRAPHY_REFERENCE,
} from '~/constants'
import DataTableStratigraphyReference from '~/components/data-table/DataTableStratigraphyReference.vue'

export default {
  components: { DataTableStratigraphyReference },
  data() {
    return {
      options: STRATIGRAPHY_REFERENCE.options,
      items: [],
      count: 0,
      search: '',
    }
  },
  async fetch() {
    const referenceResponse = await this.$services.sarvREST.getResourceList(
      'stratigraphy_reference',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
