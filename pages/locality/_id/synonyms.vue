<template>
  <stratotype-table
    :items="synonyms"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import StratotypeTable from '~/components/tables/StratotypeTable.vue'
import { SYNONYM } from '~/constants'
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
      synonyms: [],
      count: 0,
      options: SYNONYM.options,
    }
  },
  methods: {
    async handleUpdate(options) {
      const synonymResponse = await this.$services.sarvREST.getResourceList(
        'locality_synonym',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
          },
          queryFields: this.$getQueryFields(SYNONYM.queryFields),
        }
      )
      this.synonyms = synonymResponse.items
      this.count = synonymResponse.count
    },
  },
}
</script>
