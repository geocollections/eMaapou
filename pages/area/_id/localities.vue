<template>
  <div>
    <data-table-locality
      :items="localities"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import { HEADERS_AREA, AREA } from '~/constants'

export default {
  components: { DataTableLocality },
  data() {
    return {
      localities: [],
      count: 0,
      options: AREA.options,
      search: '',
    }
  },
  async fetch() {
    const solrResponse = await this.$services.sarvREST.getResourceList(
      'locality',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          area: this.$route.params.id,
        },
        fields: this.$getAPIFieldValues(HEADERS_AREA),
      }
    )

    this.localities = solrResponse.items
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
