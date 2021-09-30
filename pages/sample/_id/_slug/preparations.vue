<template>
  <preparation-table
    :items="preparations"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import PreparationTable from '~/components/tables/PreparationTable.vue'
import { HEADERS_PREPARATION } from '~/constants'
export default {
  components: { PreparationTable },
  data() {
    return {
      preparations: [],
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
      const preparationResponse = await this.$services.sarvSolr.getResourceList(
        'preparation',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `sample_id:${this.$route.params.id}`,
          },
          fields: this.$getAPIFieldValues(HEADERS_PREPARATION),
        }
      )
      this.preparations = preparationResponse.items
      this.count = preparationResponse.count
    },
  },
}
</script>
