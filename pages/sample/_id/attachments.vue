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
    sample: {
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
    async handleUpdate(options) {
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            sample: `${this.sample}`,
          },
          queryFields: this.$getQueryFields(ATTACHMENT.queryFields),
        }
      )
      this.attachments = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
