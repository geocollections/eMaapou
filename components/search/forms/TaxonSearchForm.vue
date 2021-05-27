<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="species" :label="$t(filters.byIds.species.label)" />

    <text-field v-model="locality" :label="$t(filters.byIds.locality.label)" />

    <autocomplete-field
      v-model="stratigraphyHierarchy"
      :items="autocomplete.stratigraphy"
      :loading="autocomplete.loaders.stratigraphy"
      :label="$t(filters.byIds.stratigraphyHierarchy.label)"
      :item-text="stratigraphyLabel"
      @search:items="autocompleteStratigraphySearch"
    />

    <autocomplete-field
      v-model="taxonHierarchy"
      :items="autocomplete.taxon"
      :loading="autocomplete.loaders.taxon"
      :label="$t(filters.byIds.taxonHierarchy.label)"
      :item-text="taxonLabel"
      @search:items="autocompleteTaxonSearch"
    />

    <text-field v-model="author" :label="$t(filters.byIds.author.label)" />

    <extra-options class="pt-1" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'TaxonSearchForm',
  components: {
    ExtraOptions,
    AutocompleteField,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
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
    ...mapState('taxon', ['filters']),
    ...mapFields('taxon', {
      species: 'filters.byIds.species.value',
      locality: 'filters.byIds.locality.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      taxonHierarchy: 'filters.byIds.taxonHierarchy.value',
      author: 'filters.byIds.author.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
    }),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('taxon', ['searchTaxa', 'resetTaxonFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchTaxa()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetTaxonFilters()
      this.searchTaxa()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
  },
}
</script>
