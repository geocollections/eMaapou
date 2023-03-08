<template>
  <div>
    <data-table-area
      :items="areas"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import { HEADERS_AREA, AREA } from '~/constants'

export default {
  components: { DataTableArea },
  data() {
    return {
      areas: [],
      count: 0,
      options: AREA.options,
      search: '',
    }
  },
  async fetch() {
    const solrResponse = await this.$services.sarvREST.getResourceList('area', {
      search: this.search,
      options: this.options,
      defaultParams: {
        parent_area: this.$route.params.id,
      },
      fields: this.$getAPIFieldValues(HEADERS_AREA),
    })

    this.areas = solrResponse.items
    this.count = solrResponse.count
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
