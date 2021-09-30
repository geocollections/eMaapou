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
import { DESCRIPTION, HEADERS_DESCRIPTION } from '~/constants'
import DescriptionTable from '~/components/tables/DescriptionTable.vue'

export default {
  components: { DescriptionTable },
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
      this.options = tableState.options
      const descriptionResponse = await this.$services.sarvREST.getResourceList(
        'locality_description',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            site: this.$route.params.id,
            nest: 1,
          },
          fields: this.$getAPIFieldValues(HEADERS_DESCRIPTION),
        }
      )
      this.descriptions = descriptionResponse.items.map((item) => {
        return {
          ...item,
          canExpand:
            !isEmpty(item.description) ||
            item?.rock?.name ||
            item?.rock?.name__en ||
            item.zero_level ||
            item.author_free ||
            item.reference ||
            item.year ||
            item.stratigraphy_free ||
            item.remarks,
        }
      })
      this.count = descriptionResponse.count
    },
  },
}
</script>
