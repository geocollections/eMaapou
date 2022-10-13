<template>
  <div>
    <data-table-dataset-geolocation
      :items="geolocations"
      :count="count"
      :options="options"
      id-field="dataset"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableDatasetGeolocation from '~/components/data-table/DataTableDatasetGeolocation.vue'

import { HEADERS_DATASET_GEOLOCATION } from '~/constants'
export default {
  components: { DataTableDatasetGeolocation },
  data() {
    return {
      geolocations: [],
      count: 0,
      search: '',
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
    }
  },
  async fetch() {
    const geolocationsResponse = await this.$services.sarvREST.getResourceList(
      'dataset_geolocation',
      {
        search: this.search,
        options: this.options,
        isValid: isNil(this.$route.params.id),
        defaultParams: {
          dataset: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_DATASET_GEOLOCATION),
      }
    )
    this.geolocations = geolocationsResponse.items
    this.count = geolocationsResponse.count
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
