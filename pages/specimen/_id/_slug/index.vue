<template>
  <specimen-identification-table
    :items="identifications"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SpecimenIdentificationTable from '~/components/tables/SpecimenIdentificationTable.vue'
import { SPECIMEN_IDENTIFICATION } from '~/constants'
export default {
  components: { SpecimenIdentificationTable },
  props: {
    specimen: {
      type: Number,
      default: null,
    },
  },
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
            isValid: isNil(this.specimen),
            defaultParams: {
              specimen: this.specimen,
              nest: 1,
            },
            queryFields: this.$getQueryFields(
              SPECIMEN_IDENTIFICATION.queryFields
            ),
          }
        )
      this.identifications = identificationResponse.items
      this.count = identificationResponse.count
    },
  },
}
</script>
