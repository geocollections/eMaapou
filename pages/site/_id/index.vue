<template>
  <attachment-table
    :items="attachments"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import AttachmentTable from '~/components/tables/AttachmentTable'
import { ATTACHMENT } from '~/constants'
export default {
  components: { AttachmentTable },
  props: {
    site: {
      type: Number,
      default: null,
    },
  },
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
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...tableState,
          isValid: isNil(this.site),
          defaultParams: {
            or_search: `site:${this.site}`,
          },
          queryFields: this.$getQueryFields(ATTACHMENT.queryFields),
        }
      )
      this.options = tableState.options
      this.attachments = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
