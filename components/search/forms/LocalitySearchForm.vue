<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
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
    </search-fields-wrapper>

    <search-view-map-wrapper
      locality-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON"
      @update="handleMapUpdate"
    />

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper.vue'
export default {
  name: 'LocalitySearchForm',
  components: {
    ExtraOptions,
    TextField,
    AutocompleteField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
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
    ...mapState('locality', ['filters', 'count', 'items']),
    ...mapFields('locality', {
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      reference: 'filters.byIds.reference.value',
    }),
    ...mapFields('globalSearch', {
      geoJSON: 'filters.byIds.geoJSON.value',
    }),
    ...mapGetters('locality', ['hasActiveFilters']),
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
    async handleMapUpdate(tableState) {
      await this.searchLocalities(tableState?.options)
    },
  },
}
</script>
