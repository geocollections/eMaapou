<template>
  <div>
    <data-table-attachment-solr
      :show-search="false"
      :items="items"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { ATTACHMENT, HEADERS_ATTACHMENT } from '~/constants'
import DataTableAttachmentSolr from '~/components/data-table/DataTableAttachmentSolr.vue'

export default {
  components: { DataTableAttachmentSolr },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: ATTACHMENT.options,
      items: [],
      count: 0,
    }
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
        searchFilters: {},
      }
    )
    this.items = response.items
    this.count = response.count
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
