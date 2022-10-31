<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
      <input-text v-model="species" :label="$t(filters.byIds.species.label)" />

      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-autocomplete-stratigraphy
        v-model="stratigraphyHierarchy"
        return-object
        :label="$t(filters.byIds.stratigraphyHierarchy.label)"
      />

      <input-autocomplete-taxon
        v-model="taxonHierarchy"
        :label="$t(filters.byIds.taxonHierarchy.label)"
      />

      <input-text v-model="author" :label="$t(filters.byIds.author.label)" />
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

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import Vue from 'vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputText from '~/components/input/InputText.vue'
import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import InputAutocompleteTaxon from '~/components/input/InputAutocompleteTaxon.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
export default Vue.extend({
  name: 'SearchFormTaxon',
  components: {
    InputAutocompleteStratigraphy,
    InputAutocompleteTaxon,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  computed: {
    ...mapState('search/taxon', ['filters', 'items']),
    ...mapFields('search/taxon', {
      species: 'filters.byIds.species.value',
      locality: 'filters.byIds.locality.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      taxonHierarchy: 'filters.byIds.taxonHierarchy.value',
      author: 'filters.byIds.author.value',
      query: 'query',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search/taxon', ['hasActiveFilters']),
  },
  methods: {
    handleReset() {
      this.$emit('reset')
    },
    handleSearch() {
      this.$emit('update')
    },
    handleMapUpdate() {
      this.$emit('update')
    },
  },
})
</script>
