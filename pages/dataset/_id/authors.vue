<template>
  <dataset-author-table
    :items="authors"
    :count="count"
    :options="options"
    id-field="dataset"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DatasetAuthorTable from '@/components/tables/DatasetAuthorTable'

import { DATASET_AUTHORS } from '~/constants'
export default {
  components: { DatasetAuthorTable },
  props: {
    dataset: {
      type: Number,
      default: null,
    },
  },
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
          isValid: isNil(this.dataset),
          defaultParams: {
            dataset: this.dataset,
          },
          queryFields: this.$getQueryFields(DATASET_AUTHORS.queryFields),
        }
      )
      this.authors = authorsResponse.items
      this.count = authorsResponse.count
    },
  },
}
</script>
