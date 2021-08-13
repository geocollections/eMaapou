<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('specimen')">
      <text-field v-model="number" :label="$t(filters.byIds.number.label)" />

      <text-field
        v-model="collectionNr"
        :label="$t(filters.byIds.collectionNr.label)"
      />
      <text-field
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />
      <autocomplete-field
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.hierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <text-field v-model="fossil" :label="$t(filters.byIds.fossil.label)" />
    </search-fields-wrapper>

    <!-- NOTE: Gives error: undefined field latlong -->
    <!-- <search-view-map-wrapper
      sample-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    /> -->
    <!-- NOTE: Gives errorL undefined field database_id -->
    <!-- <institution-search-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    /> -->

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
// import InstitutionSearchFilter from '~/components/search/InstitutionSearchFilter.vue'

import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions.vue'
// import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper.vue'

export default {
  name: 'SpecimenSearchForm',
  components: {
    ExtraOptions,
    // InstitutionSearchFilter,
    AutocompleteField,
    TextField,
    SearchFieldsWrapper,
    SearchActions,
    // SearchViewMapWrapper,
  },
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        stratigraphy: [],
        loaders: {
          stratigraphy: false,
        },
      },
    }
  },
  computed: {
    ...mapState('search/specimen', ['filters', 'count', 'items']),
    ...mapFields('search/specimen', {
      number: 'filters.byIds.number.value',
      collectionNr: 'filters.byIds.collectionNr.value',
      locality: 'filters.byIds.locality.value',
      fossil: 'filters.byIds.fossil.value',
      hierarchy: 'filters.byIds.hierarchy.value',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleSearch(e) {
      this.searchSpecimens()
    },
    async handleReset(e) {
      await this.resetFilters('specimen')
      this.searchSpecimens()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
    handleMapUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
