<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('locality')">
      <input-text v-model="name" :label="$t(filters.byIds.name.label)" />

      <input-text v-model="country" :label="$t(filters.byIds.country.label)" />
      <input-autocomplete-stratigraphy
        v-model="stratigraphy"
        chrono
        :label="$t(filters.byIds.stratigraphy.label)"
        :item-value="$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'"
      />
      <input-text
        v-model="reference"
        :label="$t(filters.byIds.reference.label)"
      />
    </search-fields-wrapper>

    <search-map
      locality-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON !== null"
      @update="handleMapUpdate"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputText from '~/components/input/InputText.vue'
import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormLocality',
  components: {
    InputText,
    InputAutocompleteStratigraphy,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  computed: {
    ...mapState('search/locality', ['filters', 'count', 'items']),
    ...mapFields('search/locality', {
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      reference: 'filters.byIds.reference.value',
      query: 'query',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/locality', ['searchLocalities']),
    handleSearch(e) {
      this.searchLocalities()
    },
    async handleReset(e) {
      await this.resetFilters('locality')
      this.searchLocalities()
    },
    handleMapUpdate(tableState) {
      this.searchLocalities(tableState?.options)
    },
  },
}
</script>
