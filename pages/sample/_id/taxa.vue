<template>
  <taxon-table
    :items="taxa"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import { TAXON } from '~/constants'
import TaxonTable from '~/components/tables/TaxonTable.vue'

export default {
  components: { TaxonTable },
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
      options: TAXON.options,
    }
  },
  methods: {
    async handleUpdate(options) {
      const taxonResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          ...options,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
          },
          queryFields: this.$getQueryFields(TAXON.queryFields),
        }
      )
      this.taxa = taxonResponse.items
      this.count = taxonResponse.count
    },
  },
}
</script>
