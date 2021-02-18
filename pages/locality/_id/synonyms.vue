<template>
  <table-wrapper
    :items="synonyms"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
  </table-wrapper>
</template>

<script>
import { isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  components: { TableWrapper },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      synonyms: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
      },
      headers: [
        { text: this.$t('localitySynonym.synonym'), value: 'synonym' },
        { text: this.$t('localitySynonym.pages'), value: 'pages' },
        {
          text: this.$t('localitySynonym.reference'),
          value: 'reference__reference',
        },
        { text: this.$t('localitySynonym.remarks'), value: 'remarks' },
      ],
      queryFields: {
        synonym: () => 'synonym',
        pages: () => 'pages',
        reference__reference: () => 'reference__reference',
        remarks: () => 'remarks',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const synonymResponse = await this.$services.sarvREST.getResourceList(
        'locality_synonym',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
          },
          queryFields: this.queryFields,
        }
      )
      this.synonyms = synonymResponse.items
      this.count = synonymResponse.count
    },
  },
}
</script>
