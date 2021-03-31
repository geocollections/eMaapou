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
    preparation: {
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
    async handleUpdate(options) {
      const taxonResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          ...options,
          isValid: isNil(this.preparation),
          defaultParams: {
            preparation: this.preparation,
          },
          queryFields: this.$getQueryFields(TAXON_LIST.queryFields),
        }
      )
      this.taxa = taxonResponse.items
      this.count = taxonResponse.count
    },
  },
}
</script>
