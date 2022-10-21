<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('specimen')">
      <input-text v-model="number" :label="$t(filters.byIds.number.label)" />

      <input-text
        v-model="collectionNr"
        :label="$t(filters.byIds.collectionNr.label)"
      />
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
        v-model="hierarchy"
        :label="$t(filters.byIds.hierarchy.label)"
      />
      <input-autocomplete-reference
        v-model="reference"
        :label="$t(filters.byIds.reference.label)"
      />

      <input-text
        v-model="fossilName"
        :label="$t(filters.byIds.fossilName.label)"
      />

      <input-text v-model="fossil" :label="$t(filters.byIds.fossil.label)" />

      <input-text v-model="rock" :label="$t(filters.byIds.rock.label)" />

      <input-checkbox
        v-model="has_image"
        :label="$t(filters.byIds.has_image.label)"
      />

      <input-checkbox
        v-model="has_map"
        :label="$t(filters.byIds.has_map.label)"
      />
    </search-fields-wrapper>

    <search-map
      sample-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    />

    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputText from '~/components/input/InputText.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputCheckbox from '~/components/input/InputCheckbox.vue'
import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import InputAutocompleteTaxon from '~/components/input/InputAutocompleteTaxon.vue'
import InputAutocompleteReference from '~/components/input/InputAutocompleteReference.vue'

export default {
  name: 'SearchFormSpecimen',
  components: {
    InputCheckbox,
    SearchMap,
    SearchInstitutionFilter,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    InputAutocompleteStratigraphy,
    InputAutocompleteTaxon,
    InputAutocompleteReference,
  },
  computed: {
    ...mapState('search/specimen', ['filters', 'count', 'items']),
    ...mapFields('search/specimen', {
      number: 'filters.byIds.number.value',
      collectionNr: 'filters.byIds.collectionNr.value',
      locality: 'filters.byIds.locality.value',
      fossilName: 'filters.byIds.fossilName.value',
      fossil: 'filters.byIds.fossil.value',
      rock: 'filters.byIds.rock.value',
      reference: 'filters.byIds.reference.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      has_image: 'filters.byIds.has_image.value',
      has_map: 'filters.byIds.has_map.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleSearch() {
      this.searchSpecimens()
    },
    async handleReset() {
      await this.resetFilters('specimen')
      this.searchSpecimens()
    },
    handleMapUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
