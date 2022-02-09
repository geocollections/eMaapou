<template>
  <data-table-attachment
    :items="attachments"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import DataTableAttachment from '~/components/data-table/DataTableAttachment'

import { HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { DataTableAttachment },
  data() {
    return {
      attachments: [],
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...tableState,
          defaultParams: {
            locality: `${this.$route.params.id}`,
            nest: 2,
          },
          fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
        }
      )
      this.attachments = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
