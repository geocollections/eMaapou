<template>
  <table-wrapper
    :items="references"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.taxon="{ item }">
      <a
        class="text-link"
        @click="$openWindow(`https://fossiilid.info/${item.taxon}`)"
      >
        {{ item.taxon__taxon }}
      </a>
    </template>
  </table-wrapper>
</template>

<script>
import { isNil } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'

export default {
  components: { TableWrapper },
  props: {
    sample: {
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
        {
          text: this.$t('preparation.preparation_number'),
          value: 'preparation_number',
        },
        {
          text: this.$t('preparation.taxon'),
          value: 'taxon',
        },
        { text: this.$t('preparation.storage'), value: 'storage__location' },
        { text: this.$t('preparation.remarks'), value: 'remarks' },
      ],
      queryFields: {
        preparation_number: () => 'preparation_number',
        taxon: () => 'taxon__taxon',
        storage: () => 'storage__location',
        remarks: () => 'remarks',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      const referenceResponse = await this.$services.sarvREST.getResourceList(
        'preparation',
        {
          ...options,
          isValid: isNil(this.sample),
          defaultParams: {
            sample: this.sample,
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
