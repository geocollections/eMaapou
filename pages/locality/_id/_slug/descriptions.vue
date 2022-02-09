<template>
  <data-table-description
    :items="descriptions"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { round, isNil, isEmpty } from 'lodash'
import { DESCRIPTION, HEADERS_DESCRIPTION } from '~/constants'
import DataTableDescription from '~/components/data-table/DataTableDescription.vue'

export default {
  components: { DataTableDescription },

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
            locality: this.$route.params.id,
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
            item?.rock?.name_en ||
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
