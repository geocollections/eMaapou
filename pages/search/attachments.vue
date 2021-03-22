<template>
  <attachment-solr-table
    :show-search="false"
    external-options
    :items="items"
    :count="count"
    :options="options"
    @update="handleUpdate"
  />
</template>

<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import { ATTACHMENT } from '~/constants'
import AttachmentSolrTable from '~/components/tables/AttachmentSolrTable'

export default {
  components: { AttachmentSolrTable },
  data() {
    return {
      options: ATTACHMENT.options,
      items: [],
      count: 0,
    }
  },
  computed: {
    ...mapState('landing', ['search']),
  },
  watch: {
    search: {
      handler: debounce(function (value) {
        this.options.page = 1
        this.handleUpdate({ tableOptions: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(options) {
      const response = await this.$services.sarvSolr.getResourceList(
        'attachment',
        {
          tableOptions: options.tableOptions,
          search: this.search,
          queryFields: this.$getQueryFields(ATTACHMENT.queryFields),
          searchFilters: {},
        }
      )
      this.options = options.tableOptions
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
