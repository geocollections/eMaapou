<template>
  <stratigraphy-stratotype-table
    :items="stratotypes"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import StratigraphyStratotypeTable from '~/components/tables/StratigraphyStratotypeTable'
import { STRATOTYPE } from '~/constants'

export default {
  components: { StratigraphyStratotypeTable },
  props: {
    stratigraphy: {
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
    async handleUpdate(options) {
      const stratotypeResponse = await this.$services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...options,
          isValid: isNil(this.stratigraphy),
          defaultParams: {
            stratigraphy__id: this.stratigraphy,
          },
          queryFields: this.$getQueryFields(STRATOTYPE.queryFields),
        }
      )
      this.stratotypes = stratotypeResponse.items
      this.count = stratotypeResponse.count
    },
  },
}
</script>
