<template>
  <data-table-locality
    :items="localities"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import { HEADERS_AREA, AREA } from '~/constants'

export default {
  components: { DataTableLocality },
  data() {
    return {
      localities: [],
      count: 0,
      options: AREA.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const solrResponse = await this.$services.sarvREST.getResourceList(
        'locality',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            area: this.$route.params.id,
          },
          fields: this.$getAPIFieldValues(HEADERS_AREA),
        }
      )

      this.localities = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
