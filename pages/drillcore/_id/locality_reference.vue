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
    mobile-breakpoint="0"
    @update:options="handleOptionsChange"
  >
    <template #top>
      <v-text-field
        v-model="textSearch"
        class="ma-4"
        append-icon="mdi-magnify"
        :label="$t('common.search')"
        single-line
        hide-details
        clearable
        @input="handleTextSearch"
      ></v-text-field>
    </template>
    <template #item.reference="{ item }">
      <a class="text-link" @click="openReference(item.reference)">{{
        item.reference__reference
      }}</a>
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty, debounce } from 'lodash'

export default {
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      textSearch: '',
      totalCount: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
      },
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
      sortValues: {
        reference: () => 'reference__reference',
        reference__title: () => 'reference__title',
        pages: () => 'pages',
        remarks: () => 'remarks',
      },
      localityReferences: [],
    }
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
      let params, multiSearch
      if (!isEmpty(this.textSearch))
        multiSearch = `value:${this.textSearch};fields:${Object.values(
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
      const localityReferenceResponse = await this.$axios.$get(
        'locality_reference',
        { params }
      )
      this.localityReferences = localityReferenceResponse.results
      this.totalCount = localityReferenceResponse.count
    },

    handleTextSearch: debounce(function () {
      if (this.options.page !== 1) this.options.page = 1
      else this.handleOptionsChange(this.options)
    }, 500),
  },
}
</script>
