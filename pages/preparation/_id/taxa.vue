<template>
  <div>
    <data-table-taxon-list
      :items="taxa"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { HEADERS_TAXON_LIST, TAXON_LIST } from '~/constants'
import DataTableTaxonList from '~/components/data-table/DataTableTaxonList.vue'

export default {
  components: { DataTableTaxonList },
  data() {
    return {
      taxa: [],
      count: 0,
      options: TAXON_LIST.options,
      search: '',
    }
  },
  async fetch() {
    const taxonResponse = await this.$services.sarvREST.getResourceList(
      'taxon_list',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          preparation: this.$route.params.id,
        },
        fields: this.$getAPIFieldValues(HEADERS_TAXON_LIST),
      }
    )
    this.taxa = taxonResponse.items
    this.count = taxonResponse.count
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
