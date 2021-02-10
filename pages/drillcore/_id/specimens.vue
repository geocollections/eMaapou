<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="specimens"
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
    <template #item.id="{ item }">
      <a class="text-link" @click="openSpecimen(item.id)">
        {{ item.id }}
      </a>
    </template>
    <template #item.kind="{ item }">
      {{
        $translate({
          et: item.specimen_kind,
          en: item.specimen_kind_en,
        })
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a class="text-link" @click="openStratigraphy(item.stratigraphy_id)">
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </a>
    </template>
    <template #item.taxon="{ item }">
      <a class="text-link" @click="openTaxon(item.taxon_id)">
        {{ item.taxon }}
      </a>
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
      specimens: [],
      totalCount: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
      },
      headers: [
        { text: this.$t('specimen.id'), value: 'id' },
        { text: this.$t('specimen.number'), value: 'specimen_number' },
        { text: this.$t('specimen.depth'), value: 'depth' },
        { text: this.$t('specimen.depthInterval'), value: 'depth_interval' },
        { text: this.$t('specimen.fossilGroup'), value: 'fossilgroup' },
        { text: this.$t('specimen.kind'), value: 'kind' },
        { text: this.$t('specimen.stratigraphy'), value: 'stratigraphy' },
        { text: this.$t('specimen.taxon'), value: 'taxon' },
      ],
      sortValues: {
        id: () => 'id',
        specimen_number: () => 'specimen_number',
        depth: () => 'depth',
        depth_interval: () => 'depth_interval',
        fossilgroup: () => 'fossilgroup',
        kind: () =>
          this.$i18n.locale === 'et' ? 'specimen_kind' : 'specimen_kind_en',
        stratigraphy: () =>
          this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
        taxon: () => 'taxon',
      },
    }
  },
  methods: {
    openStratigraphy(stratigraphy) {
      window.open(
        `https://geocollections.info/stratigraphy/${stratigraphy}`,
        '_blank',
        'height=800, width=800'
      )
    },
    openTaxon(taxon) {
      window.open(
        `https://fossiilid.info/${taxon}`,
        '_blank',
        'height=800, width=800'
      )
    },
    async handleOptionsChange(options) {
      const start = (options.page - 1) * options.itemsPerPage

      let params
      if (isEmpty(options.sortBy)) {
        params = {
          q: isEmpty(this.textSearch) ? '*' : `*${this.textSearch}*`,
          fq: `locality_id:${this.locality}`,
          rows: options.itemsPerPage,
          start,
        }
      } else {
        const orderBy = options.sortBy.map((field, i) => {
          if (options.sortDesc[i]) return `${this.sortValues[field]()} desc`
          return `${this.sortValues[field]()} asc`
        })

        params = {
          q: isEmpty(this.textSearch) ? '*' : `*${this.textSearch}*`,
          fq: `locality_id:${this.locality}`,
          rows: options.itemsPerPage,
          start,
          sort: orderBy.join(','),
        }
      }
      const specimenResponse = await this.$axios.$get('solr/specimen', {
        params,
      })
      this.specimens = specimenResponse.results
      this.totalCount = specimenResponse.count
    },

    handleTextSearch: debounce(function () {
      if (this.options.page !== 1) this.options.page = 1
      else this.handleOptionsChange(this.options)
    }, 500),
  },
}
</script>
