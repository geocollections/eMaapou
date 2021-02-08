<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="localityReferences"
    :options.sync="options"
    :server-items-length="totalCount"
    :footer-props="footerProps"
    @update:options="handleOptionsChange"
  >
    <template #item.reference="{ item }">
      <a class="text-link underline" @click="openReference(item.reference)">{{
        item.reference__reference
      }}</a>
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      totalCount: 0,
      options: { itemsPerPage: 25 },
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
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
      localityReferences: [],
    }
  },
  async fetch() {
    const localityReferenceResponse = await this.$axios.$get(
      'locality_reference',
      {
        params: {
          locality: this.locality,
          paginate_by: this.options.itemsPerPage,
          page: 1,
        },
      }
    )
    this.localityReferences = localityReferenceResponse.results
    this.totalCount = localityReferenceResponse.count
  },
  methods: {
    openReference(reference) {
      window.open(
        `https://geoloogia.info/reference/${reference}`,
        '_blank',
        'height=800, width=800'
      )
    },
    async handleOptionsChange(options) {
      let params
      if (isEmpty(options.sortBy)) {
        params = {
          locality: this.locality,
          paginate_by: options.itemsPerPage,
          page: options.page,
        }
      } else {
        const orderBy = options.sortBy.map((field, i) => {
          if (options.sortDesc[i]) return `-${field}`
          return field
        })

        params = {
          locality: this.locality,
          paginate_by: options.itemsPerPage,
          page: options.page,
          order_by: orderBy.join(','),
        }
      }
      const localityReferenceResponse = await this.$axios.$get(
        'locality_reference',
        { params }
      )
      this.localityReferences = localityReferenceResponse.results
      this.totalCount = localityReferenceResponse.count
    },
  },
}
</script>
