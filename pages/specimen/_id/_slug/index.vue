<template>
  <data-table-specimen-identification
    :items="identifications"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSpecimenIdentification from '~/components/data-table/DataTableSpecimenIdentification.vue'
import { HEADERS_SPECIMEN_IDENTIFICATION } from '~/constants'
export default {
  components: { DataTableSpecimenIdentification },
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
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const identificationResponse =
        await this.$services.sarvREST.getResourceList(
          'specimen_identification',
          {
            ...tableState,
            isValid: isNil(this.$route.params.id),
            defaultParams: {
              specimen: this.$route.params.id,
              nest: 1,
            },
            fields: this.$getAPIFieldValues(HEADERS_SPECIMEN_IDENTIFICATION),
          }
        )
      this.identifications = identificationResponse.items
      this.count = identificationResponse.count
    },
  },
}
</script>
