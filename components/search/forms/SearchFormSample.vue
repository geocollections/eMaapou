<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('sample')">
      <input-text v-model="number" :label="$t(filters.byIds.number.label)" />

      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-autocomplete
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.hierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <input-text
        v-model="collector"
        :label="$t(filters.byIds.collector.label)"
      />
      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />

      <input-text v-model="mass" :label="$t(filters.byIds.mass.label)" />
      <input-text v-model="project" :label="$t(filters.byIds.project.label)" />
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
import { isEmpty } from 'lodash'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputRange from '~/components/input/InputRange.vue'
import InputText from '~/components/input/InputText.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormSample',
  components: {
    SearchInstitutionFilter,
    InputAutocomplete,
    InputText,
    InputRange,
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
        loaders: {
          stratigraphy: false,
        },
      },
    }
  },
  computed: {
    ...mapState('search/sample', ['filters', 'count', 'items']),
    ...mapFields('search/sample', {
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
      project: 'filters.byIds.project.value',
      query: 'query',
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
    ...mapActions('search/sample', ['searchSamples']),
    handleSearch(e) {
      this.searchSamples()
    },
    async handleReset(e) {
      await this.resetFilters('sample')
      this.searchSamples()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
    handleMapUpdate(tableState) {
      this.searchSamples(tableState?.options)
    },
  },
}
</script>
