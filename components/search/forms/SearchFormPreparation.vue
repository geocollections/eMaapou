<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
      <input-text v-model="number" :label="$t(filters.byIds.number.label)" />
      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />
      <input-autocomplete-stratigraphy
        v-model="hierarchy"
        return-object
        :label="$t(filters.byIds.hierarchy.label)"
      />

      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />
    </search-fields-wrapper>

    <search-map
      :items="items"
      class="mt-2"
      :active="!!geoJSON"
      @update="handleMapUpdate"
    />
    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="handleInstitutionsUpdate"
    />
  </v-form>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

import Vue from 'vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputText from '~/components/input/InputText.vue'
import InputRange from '~/components/input/InputRange.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
export default Vue.extend({
  name: 'SearchFormPreparation',
  components: {
    SearchInstitutionFilter,
    InputAutocompleteStratigraphy,
    InputText,
    InputRange,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  computed: {
    ...mapState('search/preparation', ['filters', 'items']),
    ...mapFields('search/preparation', {
      number: 'filters.byIds.number.value',
      depth: 'filters.byIds.depth.value',
      locality: 'filters.byIds.locality.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search/preparation', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    handleReset() {
      this.$emit('reset')
    },
    handleSearch() {
      this.$emit('update')
    },
    handleMapUpdate() {
      this.$emit('update')
    },
    handleInstitutionsUpdate(newInstitutions: any[]) {
      this.institution = newInstitutions
      this.$emit('update')
    },
  },
})
</script>
