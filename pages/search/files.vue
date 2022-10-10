<template>
  <data-table-attachment-solr
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import debounce from 'lodash/debounce'
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
  watch: {
    query: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 400),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      this.options = tableState.options
      const response = await this.$services.sarvSolr.getResourceList(
        'attachment',
        {
          options: tableState.options,
          search: this.query,
          fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
          searchFilters: {},
        }
      )
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
