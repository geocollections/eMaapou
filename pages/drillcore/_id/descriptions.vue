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
    <template #item.thickness="{ item }">
      {{
        !item.depth_base || !item.depth_top
          ? null
          : round(item.depth_base - item.depth_top, 3)
      }}
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
import { round, isNil } from 'lodash'
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
          text: this.$t('localityDescription.thickness'),
          value: 'thickness',
          sortable: false,
          class: 'static-cell-header',
          cellClass: 'static-cell',
        },
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
      queryFields: {
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
    round,
    async handleUpdate(options) {
      const descriptionResponse = await this.$services.sarvREST.getResourceList(
        'locality_description',
        {
          ...options,
          isValid: isNil(this.locality),
          defaultParams: {
            locality: this.locality,
          },
          queryFields: this.queryFields,
        }
      )
      this.descriptions = descriptionResponse.items
      this.count = descriptionResponse.count
    },
  },
}
</script>
