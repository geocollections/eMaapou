<template>
  <div>
    <data-table-preparation
      :items="preparations"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import { HEADERS_PREPARATION } from '~/constants'
export default {
  components: { DataTablePreparation },
  data() {
    return {
      preparations: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      search: '',
    }
  },
  async fetch() {
    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `sample_id:${this.$route.params.id}`,
        },
        fields: this.$getAPIFieldValues(HEADERS_PREPARATION),
      }
    )
    this.preparations = preparationResponse.items
    this.count = preparationResponse.count
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
