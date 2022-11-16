<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
      <input-text v-model="id" :label="$t(filters.byIds.id.label)" />
      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />
      <input-text v-model="method" :label="$t(filters.byIds.method.label)" />
      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />
      <input-text v-model="sample" :label="$t(filters.byIds.sample.label)" />
      <input-text v-model="agent" :label="$t(filters.byIds.agent.label)" />
      <input-text v-model="lab" :label="$t(filters.byIds.lab.label)" />
      <!-- <input-autocomplete-stratigraphy
        v-model="stratigraphy"
        return-object
        :label="$t(filters.byIds.stratigraphy.label)"
      />
      <input-text v-model="dataset" :label="$t(filters.byIds.dataset.label)" /> -->
    </search-fields-wrapper>

    <search-map
      :items="items"
      class="mt-2"
      :active="geoJSON !== null"
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
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import InputRange from '~/components/input/InputRange.vue'
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
export default Vue.extend({
  name: 'SearchFormAnalysis',
  components: {
    SearchInstitutionFilter,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
    InputRange,
    // InputAutocompleteStratigraphy,
  },
  computed: {
    ...mapState('search/analysis', ['filters', 'items']),
    ...mapFields('search/analysis', {
      id: 'filters.byIds.id.value',
      depth: 'filters.byIds.depth.value',
      method: 'filters.byIds.method.value',
      agent: 'filters.byIds.agent.value',
      dataset: 'filters.byIds.dataset.value',
      lab: 'filters.byIds.lab.value',
      sample: 'filters.byIds.sample.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search/analysis', ['hasActiveFilters']),
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
