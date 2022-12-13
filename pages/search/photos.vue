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
import { HEADERS_PHOTO, IMAGE } from '~/constants'
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
      options: IMAGE.options,
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
        fields: this.$getAPIFieldValues(HEADERS_PHOTO),
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
  watch: {
    '$route.query': function (newQuery, oldQuery) {
      if (
        !this._inactive &&
        JSON.stringify(newQuery) !== JSON.stringify(oldQuery)
      ) {
        this.$fetch()
      }
    },
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
