<template>
  <div>
    <data-table-specimen-identification
      :items="identifications"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
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
      search: '',
    }
  },
  async fetch() {
    const identificationResponse =
      await this.$services.sarvREST.getResourceList('specimen_identification', {
        search: this.search,
        options: this.options,
        defaultParams: {
          specimen: this.$route.params.id,
          nest: 1,
        },
        fields: this.$getAPIFieldValues(HEADERS_SPECIMEN_IDENTIFICATION),
      })
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
