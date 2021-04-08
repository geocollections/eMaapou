<template>
  <taxon-list-table
    :items="taxa"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { TAXON_LIST } from '~/constants'
import TaxonListTable from '~/components/tables/TaxonListTable'

export default {
  components: { TaxonListTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      taxa: [],
      count: 0,
      options: TAXON_LIST.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const taxonResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          ...tableState,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
          },
          queryFields: this.$getQueryFields(TAXON_LIST.queryFields),
        }
      )
      this.options = tableState.options
      this.taxa = taxonResponse.items
      this.count = taxonResponse.count
    },
  },
}
</script>
