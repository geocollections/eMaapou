<template>
  <v-data-table
    dense
    calculate-widths
    multi-sort
    :headers="headers"
    :items="localityDescriptions"
    :options.sync="options"
    :server-items-length="totalCount"
    :footer-props="footerProps"
    @update:options="handleOptionsChange"
  >
    <template #item.rock="{ item }">
      {{ $translate({ et: item.rock__name, en: item.rock__name_en }) }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a class="text-link underline" @click="openStratigraphy(item.stratigraphy)">
        {{
          $translate({
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          })
        }}
      </a>
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
      options: {
        itemsPerPage: 25,
        sortBy: ['depth_top', 'depth_base'],
        sortDesc: [false, true],
      },
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
      },
      headers: [
        { text: this.$t('localityDescription.depthTop'), value: 'depth_top' },
        { text: this.$t('localityDescription.depthBase'), value: 'depth_base' },
        {
          text: this.$t('localityDescription.rock'),
          value: 'rock',
        },
        {
          text: this.$t('localityDescription.stratigraphy'),
          value: 'stratigraphy',
        },
        {
          text: this.$t('localityDescription.description'),
          value: 'description',
        },
      ],
      localityDescriptions: [],
    }
  },
  async fetch() {
    const localityDescriptionResponse = await this.$axios.$get(
      'locality_description',
      {
        params: {
          locality: this.locality,
          paginate_by: this.options.itemsPerPage,
          page: 1,
        },
      }
    )
    this.localityDescriptions = localityDescriptionResponse.results
    this.totalCount = localityDescriptionResponse.count
  },
  methods: {
    openStratigraphy(stratigraphy) {
      window.open(
        `https://geocollections.info/stratigraphy/${stratigraphy}`,
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
      const localityDescriptionResponse = await this.$axios.$get(
        'locality_description',
        { params }
      )
      this.localityDescriptions = localityDescriptionResponse.results
      this.totalCount = localityDescriptionResponse.count
    },
  },
}
</script>
