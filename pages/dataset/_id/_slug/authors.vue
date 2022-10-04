<template>
  <data-table-dataset-author
    :items="authors"
    :count="count"
    :options="options"
    id-field="dataset"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'

import { HEADERS_DATASET_AUTHOR } from '~/constants'
export default {
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
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const authorsResponse = await this.$services.sarvREST.getResourceList(
        'dataset_author',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
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
  },
}
</script>
