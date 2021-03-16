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
import DescriptionTable from '~/components/tables/DescriptionTable.vue'
import { DESCRIPTION } from '~/constants'

export default {
  components: { DescriptionTable },
  props: {
    locality: {
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
    async handleUpdate(options) {
      const descriptionResponse = await this.$services.sarvREST.getResourceList(
        'locality_description',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
          },
          queryFields: this.$getQueryFields(DESCRIPTION.queryFields),
        }
      )
      this.descriptions = descriptionResponse.items.map((item) => {
        return { ...item, canExpand: !isEmpty(item.description) }
      })
      this.count = descriptionResponse.count
    },
  },
}
</script>
