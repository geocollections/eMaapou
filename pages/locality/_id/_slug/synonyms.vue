<template>
  <synonym-table
    :items="synonyms"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import SynonymTable from '~/components/tables/SynonymTable.vue'
import { HEADERS_SYNONYM, SYNONYM } from '~/constants'
export default {
  components: { SynonymTable },
  data() {
    return {
      synonyms: [],
      count: 0,
      options: SYNONYM.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const synonymResponse = await this.$services.sarvREST.getResourceList(
        'locality_synonym',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            locality: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_SYNONYM),
        }
      )
      this.synonyms = synonymResponse.items
      this.count = synonymResponse.count
    },
  },
}
</script>
