<template>
  <table-wrapper
    :items="references"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.reference="{ item }">
      <a class="text-link" @click="$openGeology('reference', item.reference)">{{
        item.reference__reference
      }}</a>
    </template>
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
      references: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
      },
      headers: [
        { text: this.$t('localityReference.reference'), value: 'reference' },
        {
          text: this.$t('localityReference.referenceTitle'),
          value: 'reference__title',
        },
        { text: this.$t('localityReference.pages'), value: 'pages' },
        { text: this.$t('localityReference.remarks'), value: 'remarks' },
      ],
      queryFields: {
        reference: () => 'reference__reference',
        reference__title: () => 'reference__title',
        pages: () => 'pages',
        remarks: () => 'remarks',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'locality_reference',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
          },
          queryFields: this.queryFields,
        }
      )
      this.references = referenceResponse.items
      this.count = referenceResponse.count
    },
  },
}
</script>
