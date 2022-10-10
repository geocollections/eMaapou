<template>
  <data-table-attachment
    :items="attachments"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableAttachment from '~/components/data-table/DataTableAttachment.vue'
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { DataTableAttachment },
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
          fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
        }
      )
      this.attachments = attachmentResponse.items
      this.count = attachmentResponse.count
    },
  },
}
</script>
