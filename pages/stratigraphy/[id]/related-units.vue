<template>
  <div>
    <data-table-stratigraphy
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { HEADERS_STRATIGRAPHY, STRATIGRAPHY } from '~/constants'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy.vue'

export default {
  components: { DataTableStratigraphy },
  data() {
    return {
      options: STRATIGRAPHY.options,
      items: [],
      count: 0,
      search: '',
    }
  },
  async fetch() {
    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'stratigraphy',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `age_chronostratigraphy:${this.$route.params.id}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY),
      }
    )
    this.items = analysisResponse.items
    this.count = analysisResponse.count
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
