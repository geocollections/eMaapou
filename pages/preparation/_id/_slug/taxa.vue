<template>
  <data-table-taxon-list
    :items="taxa"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { HEADERS_TAXON_LIST, TAXON_LIST } from '~/constants'
import DataTableTaxonList from '~/components/data-table/DataTableTaxonList'

export default {
  components: { DataTableTaxonList },
  data() {
    return {
      taxa: [],
      count: 0,
      options: TAXON_LIST.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const taxonResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            preparation: this.$route.params.id,
          },
          fields: this.$getAPIFieldValues(HEADERS_TAXON_LIST),
        }
      )
      this.taxa = taxonResponse.items
      this.count = taxonResponse.count
    },
  },
}
</script>
