<template>
  <attachment-solr-table
    :show-search="false"
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { debounce } from 'lodash'
import { ATTACHMENT } from '~/constants'
import AttachmentSolrTable from '~/components/tables/AttachmentSolrTable'

export default {
  components: { AttachmentSolrTable },
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
      }, 500),
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
          queryFields: this.$getQueryFields(ATTACHMENT.queryFields),
          searchFilters: {},
        }
      )
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
