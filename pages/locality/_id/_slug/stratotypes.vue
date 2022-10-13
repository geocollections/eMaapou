<template>
  <div>
    <data-table-stratotype
      :items="stratotypes"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableStratotype from '~/components/data-table/DataTableStratotype.vue'
import { HEADERS_STRATOTYPE, STRATOTYPE } from '~/constants'

export default {
  components: { DataTableStratotype },
  data() {
    return {
      stratotypes: [],
      count: 0,
      options: STRATOTYPE.options,
      search: '',
    }
  },
  async fetch() {
    const stratotypeResponse = await this.$services.sarvREST.getResourceList(
      'stratigraphy_stratotype',
      {
        search: this.search,
        options: this.options,
        isValid: isNil(this.$route.params.id),
        defaultParams: {
          locality: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_STRATOTYPE),
      }
    )
    this.stratotypes = stratotypeResponse.items
    this.count = stratotypeResponse.count
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
