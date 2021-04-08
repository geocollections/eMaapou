<template>
  <stratotype-table
    :items="stratotypes"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import StratotypeTable from '~/components/tables/StratotypeTable'
import { STRATOTYPE } from '~/constants'

export default {
  components: { StratotypeTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      stratotypes: [],
      count: 0,
      options: STRATOTYPE.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      const stratotypeResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            locality__id: this.locality,
          },
          queryFields: this.$getQueryFields(STRATOTYPE.queryFields),
        }
      )
      this.options = tableState.options
      this.stratotypes = stratotypeResponse.items
      this.count = stratotypeResponse.count
    },
  },
}
</script>
