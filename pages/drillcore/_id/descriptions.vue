<template>
  <table-wrapper
    :items="descriptions"
    :headers="headers"
    :count="count"
    :init-options="options"
    @update="handleUpdate"
  >
    <template #item.rock="{ item }">
      {{ $translate({ et: item.rock__name, en: item.rock__name_en }) }}
    </template>
    <template #item.stratigraphy="{ item }">
      <a
        class="text-link"
        @click="openGeoDetail({ table: 'stratigraphy', id: item.stratigraphy })"
      >
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
        @click="openGeoDetail({ table: 'reference', id: item.reference })"
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
  </table-wrapper>
</template>

<script>
import { isEmpty } from 'lodash'
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
      descriptions: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: ['depth_top', 'depth_base'],
        sortDesc: [false, true],
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
        // TODO: #81 Use Vuetify Data Table expanded item to display description
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
        author: () => 'reference__reference,agent__agent,author_free',
      },
    }
  },
  methods: {
    async handleUpdate(options) {
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
      const descriptionResponse = await this.$axios.$get(
        'locality_description',
        { params }
      )
      this.descriptions = descriptionResponse.results
      this.count = descriptionResponse.count
    },
  },
}
</script>
