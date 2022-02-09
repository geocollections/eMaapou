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
import AttachmentTable from '~/components/tables/AttachmentTable'

import { HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { AttachmentTable },
  props: {
    locality: {
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
      this.options = tableState.options
      const attachmentResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          ...tableState,
          isValid: isNil(this.locality),
          defaultParams: {
            nest: 2,
            or_search: `drillcore:${this.$route.params.id} OR locality:${this.locality}`,
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
