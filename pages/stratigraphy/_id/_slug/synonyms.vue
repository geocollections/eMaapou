<template>
  <div>
    <data-table-stratigraphy-synonym
      :items="synonyms"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
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
      search: '',
    }
  },
  async fetch() {
    const synonymResponse = await this.$services.sarvREST.getResourceList(
      'stratigraphy_synonym',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
