<template>
  <data-table-dataset-geolocation
    :items="geolocations"
    :count="count"
    :options="options"
    id-field="dataset"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'

import { HEADERS_DATASET_GEOLOCATION } from '~/constants'
export default {
  data() {
    return {
      geolocations: [],
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
      const geolocationsResponse =
        await this.$services.sarvREST.getResourceList('dataset_geolocation', {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            dataset: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_DATASET_GEOLOCATION),
        })
      this.geolocations = geolocationsResponse.items
      this.count = geolocationsResponse.count
    },
  },
}
</script>
