<template>
  <div>
    <data-table-attachment
      :items="attachments"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableAttachment from '~/components/data-table/DataTableAttachment.vue'
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { DataTableAttachment },
  data() {
    return {
      attachments: [],
      count: 0,
      options: ATTACHMENT_LINK.options,
      search: '',
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          sample: `${this.$route.params.id}`,
          nest: 2,
        },
        fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
      }
    )
    this.attachments = attachmentResponse.items
    this.count = attachmentResponse.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
