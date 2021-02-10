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
    <template #item.rock="{ item }">
      {{ $translate({ et: item.rock__name, en: item.rock__name_en }) }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a class="text-link" @click="openStratigraphy(item.stratigraphy)">
        {{
          $translate({
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          })
        }}
      </a>
    </template>
    <template #item.author="{ item }">
      <a
        v-if="item.reference"
        :class="{ 'is-preferred': !item.is_preferred, 'text-link': true }"
        @click="openReference(item.reference)"
      >
        {{ item.reference__reference }}
      </a>
      <div
        v-else-if="item.agent__agent"
        :class="{ 'is-preferred': !item.is_preferred }"
      >
        {{ item.agent__agent }}
      </div>
      <div v-else :class="{ 'is-preferred': !item.is_preferred }">
        {{ item.author_free }}
      </div>
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
        {
          text: this.$t('localityDescription.author'),
          value: 'author',
          sortable: false,
        },
      ],
      sortValues: {
        rock: () => {
          return this.$i18n.locale === 'et' ? 'rock__name' : 'rock__name_en'
        },
        stratigraphy: () => {
          return this.$i18n.locale === 'et'
            ? 'stratigraphy__stratigraphy'
            : 'stratigraphy__stratigraphy_en'
        },
        description: () => 'description',
        depth_top: () => 'depth_top',
        depth_base: () => 'depth_base',
      },
      localityDescriptions: [],
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
      const localityDescriptionResponse = await this.$axios.$get(
        'locality_description',
        { params }
      )
      this.localityDescriptions = localityDescriptionResponse.results
      this.totalCount = localityDescriptionResponse.count
    },

    handleTextSearch: debounce(function () {
      if (this.options.page !== 1) this.options.page = 1
      else this.handleOptionsChange(this.options)
    }, 500),
  },
}
</script>
