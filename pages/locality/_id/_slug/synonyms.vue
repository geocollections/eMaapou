<template>
  <div>
    <data-table-synonym
      :items="synonyms"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableSynonym from '~/components/data-table/DataTableSynonym.vue'
import { HEADERS_SYNONYM, SYNONYM } from '~/constants'
export default {
  components: { DataTableSynonym },
  data() {
    return {
      synonyms: [],
      count: 0,
      options: SYNONYM.options,
      search: '',
    }
  },
  async fetch() {
    const synonymResponse = await this.$services.sarvREST.getResourceList(
      'locality_synonym',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          locality: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_SYNONYM),
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
