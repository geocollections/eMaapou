<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="name" :label="$t(filters.byIds.name.label)" />

    <text-field v-model="country" :label="$t(filters.byIds.country.label)" />

    <autocomplete-field
      v-model="stratigraphy"
      :items="autocomplete.chronostratigraphy"
      :loading="autocomplete.loaders.chronostratigraphy"
      :label="$t(filters.byIds.stratigraphy.label)"
      :item-text="stratigraphyLabel"
      :item-value="stratigraphyLabel"
      @search:items="autocompleteChronostratigraphySearch"
    />

    <text-field
      v-model="reference"
      :label="$t(filters.byIds.reference.label)"
    />

    <extra-options class="pt-1" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'LocalitySearchForm',
  components: {
    ExtraOptions,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    AutocompleteField,
  },
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        chronostratigraphy: [],
        lithostratigraphy: [],
        loaders: {
          chronostratigraphy: false,
          lithostratigraphy: false,
        },
      },
    }
  },
  computed: {
    ...mapState('locality', ['filters']),
    ...mapFields('locality', {
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      reference: 'filters.byIds.reference.value',
    }),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities', 'resetLocalityFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchLocalities()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetLocalityFilters()
      this.searchLocalities()
    },
  },
}
</script>
