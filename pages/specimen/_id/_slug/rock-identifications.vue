<template>
  <div>
    <data-table-specimen-identification-geology
      :items="identifications"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSpecimenIdentificationGeology from '~/components/data-table/DataTableSpecimenIdentificationGeology.vue'
import { HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY } from '~/constants'
export default {
  components: { DataTableSpecimenIdentificationGeology },
  data() {
    return {
      identifications: [],
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
    const identificationResponse =
      await this.$services.sarvREST.getResourceList(
        'specimen_identification_geology',
        {
          search: this.search,
          options: this.options,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            specimen: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(
            HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY
          ),
        }
      )
    this.identifications = identificationResponse.items
    this.count = identificationResponse.count
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
