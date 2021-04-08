<template>
  <description-table
    :items="descriptions"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { round, isNil, isEmpty } from 'lodash'
import { DESCRIPTION } from '~/constants'
import DescriptionTable from '~/components/tables/DescriptionTable.vue'

export default {
  components: { DescriptionTable },
  props: {
    site: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      descriptions: [],
      count: 0,
      options: DESCRIPTION.options,
    }
  },
  methods: {
    round,
    async handleUpdate(tableState) {
      const descriptionResponse = await this.$services.sarvREST.getResourceList(
        'locality_description',
        {
          ...tableState,
          isValid: isNil(this.site),
          defaultParams: {
            site: this.site,
          },
          queryFields: this.$getQueryFields(DESCRIPTION.queryFields),
        }
      )
      this.options = tableState.options
      this.descriptions = descriptionResponse.items.map((item) => {
        return { ...item, canExpand: !isEmpty(item.description) }
      })
      this.count = descriptionResponse.count
    },
  },
}
</script>
