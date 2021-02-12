<template>
  <table-wrapper
    :items="references"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.reference="{ item }">
      <a
        class="text-link"
        @click="
          openGeoDetail({ table: 'reference', id: item.reference__reference })
        "
        >{{ item.reference__reference }}</a
      >
    </template>
  </table-wrapper>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
import global from '@/mixins/global'
import TableWrapper from '~/components/TableWrapper.vue'

export default {
  components: { TableWrapper },
  mixins: [global],
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
      sortValues: {
        reference: () => 'reference__reference',
        reference__title: () => 'reference__title',
        pages: () => 'pages',
        remarks: () => 'remarks',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
      if (isNil(this.locality)) {
        this.references = []
        this.count = 0
        return
      }

      let params, multiSearch
      if (!isEmpty(options.search))
        multiSearch = `value:${options.search};fields:${Object.values(
          this.sortValues
        )
          .map((field) => field())
          .join()};lookuptype:icontains`
      if (isEmpty(options.sortBy)) {
        params = {
          multi_search: multiSearch,
          locality: this.locality,
          paginate_by: options.itemsPerPage,
          page: options.page,
        }
      } else {
        const orderBy = options.sortBy.map((field, i) => {
          if (options.sortDesc[i]) return `-${this.sortValues[field]()}`
          return this.sortValues[field]()
        })

        params = {
          multi_search: multiSearch,
          locality: this.locality,
          paginate_by: options.itemsPerPage,
          page: options.page,
          order_by: orderBy.join(','),
        }
      }
      const referenceResponse = await this.$axios.$get('locality_reference', {
        params,
      })
      this.references = referenceResponse.results
      this.count = referenceResponse.count
    },
  },
}
</script>
