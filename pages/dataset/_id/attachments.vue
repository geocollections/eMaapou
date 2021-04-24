<template>
  <attachment-table
    :items="attachments"
    :count="count"
    :options="options"
    id-field="attachment"
    @update="handleUpdate"
  />
</template>

<script>
import { isNil } from 'lodash'
import AttachmentTable from '@/components/tables/AttachmentTable'

import { ATTACHMENT } from '~/constants'
export default {
  components: { AttachmentTable },
  props: {
    dataset: {
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
          isValid: isNil(this.dataset),
          defaultParams: {
            dataset: this.dataset,
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
