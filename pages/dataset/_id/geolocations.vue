<template>
  <dataset-geolocation-table
    :items="geolocations"
    :count="count"
    :options="options"
    id-field="dataset"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import DatasetGeolocationTable from '@/components/tables/DatasetGeolocationTable'

import { DATASET_GEOLOCATIONS } from '~/constants'
export default {
  components: { DatasetGeolocationTable },
  props: {
    dataset: {
      type: Number,
      default: null,
    },
  },
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
      const geolocationsResponse = await this.$services.sarvREST.getResourceList(
        'dataset_geolocation',
        {
          ...tableState,
          isValid: isNil(this.dataset),
          defaultParams: {
            dataset: this.dataset,
          },
          queryFields: this.$getQueryFields(DATASET_GEOLOCATIONS.queryFields),
        }
      )
      this.geolocations = geolocationsResponse.items
      this.count = geolocationsResponse.count
    },
  },
}
</script>
