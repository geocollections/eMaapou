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

<script lang="ts">
import Vue from 'vue'
import DataTableAttachment from '~/components/data-table/DataTableAttachment.vue'
import { HEADERS_ATTACHMENT } from '~/constants'
export default Vue.extend({
  components: { DataTableAttachment },
  data() {
    return {
      attachments: [],
      count: 0,
      search: '',
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          analysis: this.$route.params.id,
          nest: 2,
        },
        fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
      }
    )
    this.attachments = attachmentResponse.items
    this.count = attachmentResponse.count
  },
  methods: {
    handleUpdate(tableState: any) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
})
</script>
