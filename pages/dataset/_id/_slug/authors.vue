<template>
  <div>
    <data-table-dataset-author
      :items="authors"
      :count="count"
      :options="options"
      id-field="dataset"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableDatasetAuthor from '~/components/data-table/DataTableDatasetAuthor.vue'

import { HEADERS_DATASET_AUTHOR } from '~/constants'
export default {
  components: { DataTableDatasetAuthor },
  data() {
    return {
      authors: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
    }
  },
  async fetch() {
    const authorsResponse = await this.$services.sarvREST.getResourceList(
      'dataset_author',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          dataset: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_DATASET_AUTHOR),
      }
    )
    this.authors = authorsResponse.items
    this.count = authorsResponse.count
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
