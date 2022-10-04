<template>
  <data-table-area
    :items="areas"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import { HEADERS_AREA, AREA } from '~/constants'

export default {
  components: { DataTableArea },
  data() {
    return {
      areas: [],
      count: 0,
      options: AREA.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const solrResponse = await this.$services.sarvREST.getResourceList(
        'area',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            parent_area: this.$route.params.id,
          },
          fields: this.$getAPIFieldValues(HEADERS_AREA),
        }
      )

      this.areas = solrResponse.items
      this.count = solrResponse.count
    },
  },
}
</script>
