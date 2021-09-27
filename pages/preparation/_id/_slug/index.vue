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
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { AttachmentTable },
  data() {
    return {
      attachments: [],
      count: 0,
      options: ATTACHMENT_LINK.options,
    }
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            preparation: `${this.$route.params.id}`,
            nest: 2,
          },
          queryFields: this.$getSortValues(HEADERS_ATTACHMENT),
        }
      )
      this.attachments = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
