<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('taxon')">
      <input-text v-model="species" :label="$t(filters.byIds.species.label)" />

      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-autocomplete
        v-model="stratigraphyHierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.stratigraphyHierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <input-autocomplete
        v-model="taxonHierarchy"
        :items="autocomplete.taxon"
        :loading="autocomplete.loaders.taxon"
        :label="$t(filters.byIds.taxonHierarchy.label)"
        :item-text="taxonLabel"
        @search:items="autocompleteTaxonSearch"
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

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputText from '~/components/input/InputText'
import InputAutocomplete from '~/components/input/InputAutocomplete'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import SearchMap from '~/components/search/SearchMap'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormTaxon',
  components: {
    InputAutocomplete,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        stratigraphy: [],
        taxon: [],
        loaders: {
          stratigraphy: false,
          taxon: false,
        },
      },
    }
  },
  computed: {
    ...mapState('search/taxon', ['filters', 'count', 'items']),
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
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/taxon', ['searchTaxa']),
    handleSearch(e) {
      this.searchTaxa()
    },
    async handleReset(e) {
      await this.resetFilters('taxon')
      this.searchTaxa()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
    handleMapUpdate(tableState) {
      this.searchTaxa(tableState?.options)
    },
  },
}
</script>
