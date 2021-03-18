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
import { PREPARATION } from '~/constants'
export default {
  components: { PreparationTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
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
    async handleUpdate(options) {
      const preparationResponse = await this.$services.sarvREST.getResourceList(
        'preparation',
        {
          ...options,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
          },
          queryFields: this.$getQueryFields(PREPARATION.queryFields),
        }
      )
      this.preparations = preparationResponse.items
      this.count = preparationResponse.count
    },
  },
}
</script>
