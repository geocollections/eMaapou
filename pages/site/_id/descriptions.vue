<template>
  <div>
    <data-table-description
      :items="descriptions"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import round from 'lodash/round'
import isEmpty from 'lodash/isEmpty'
import { DESCRIPTION, HEADERS_DESCRIPTION } from '~/constants'
import DataTableDescription from '~/components/data-table/DataTableDescription.vue'

export default {
  components: { DataTableDescription },
  data() {
    return {
      descriptions: [],
      count: 0,
      options: DESCRIPTION.options,
      search: '',
    }
  },
  async fetch() {
    const descriptionResponse = await this.$services.sarvREST.getResourceList(
      'locality_description',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    round,

    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
