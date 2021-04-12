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
        this.handleUpdate({ options: { ...this.options }, search: value })
      }, 500),
    },
  },
  methods: {
    async handleUpdate(tableState) {
      const response = await this.$services.sarvSolr.getResourceList(
        'attachment',
        {
          options: tableState.options,
          search: this.search,
          queryFields: this.$getQueryFields(ATTACHMENT.queryFields),
          searchFilters: {},
        }
      )
      this.options = tableState.options
      this.items = response.items
      this.count = response.count
    },
  },
}
</script>
