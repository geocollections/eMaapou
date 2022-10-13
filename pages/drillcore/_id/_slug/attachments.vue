<template>
  <div>
    <data-table-attachment
      :items="attachments"
      :count="count"
      :options="options"
      id-field="attachment"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableAttachment from '~/components/data-table/DataTableAttachment.vue'

import { HEADERS_ATTACHMENT } from '~/constants'
export default {
  components: { DataTableAttachment },
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
      search: '',
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        search: this.search,
        options: this.options,
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
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
