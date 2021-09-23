<template>
  <specimen-identification-geology-table
    :items="identifications"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SpecimenIdentificationGeologyTable from '~/components/tables/SpecimenIdentificationGeologyTable.vue'
import { SPECIMEN_IDENTIFICATION_GEOLOGY } from '~/constants'
export default {
  components: { SpecimenIdentificationGeologyTable },
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
          'specimen_identification_geology',
          {
            ...tableState,
            isValid: isNil(this.$route.params.id),
            defaultParams: {
              specimen: this.$route.params.id,
              nest: 1,
            },
            queryFields: this.$getQueryFields(
              SPECIMEN_IDENTIFICATION_GEOLOGY.queryFields
            ),
          }
        )
      this.identifications = identificationResponse.items
      this.count = identificationResponse.count
    },
  },
}
</script>
