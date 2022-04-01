<template>
  <data-table-description
    :items="descriptions"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import round from 'lodash/round'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import DataTableDescription from '~/components/data-table/DataTableDescription.vue'
import { DESCRIPTION, HEADERS_DESCRIPTION } from '~/constants'

export default {
  components: { DataTableDescription },
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const descriptionResponse = await this.$services.sarvREST.getResourceList(
        'locality_description',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
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
            item.rock?.name ||
            item.rock?.name_en ||
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
