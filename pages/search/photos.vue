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
import { IMAGE } from '~/constants'
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
      options: IMAGE.options,
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
          queryFields: this.$getQueryFields(IMAGE.queryFields),
          searchFilters: {
            specimenImageAttachment: {
              value: '2',
              type: 'text',
              lookUpType: 'equals',
              fields: ['specimen_image_attachment'],
            },
          },
        }
      )
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
