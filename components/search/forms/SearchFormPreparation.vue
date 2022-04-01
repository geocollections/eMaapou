<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('preparation')">
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
import InputRange from '~/components/input/InputRange.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'SearchFormPreparation',
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
    ...mapState('search/preparation', ['filters', 'count', 'items']),
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
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/preparation', ['searchPreparations']),
    async handleReset(e) {
      await this.resetFilters('preparation')
      this.searchPreparations()
    },
    handleSearch(e) {
      this.searchPreparations()
    },
    handleMapUpdate(tableState) {
      this.searchPreparations(tableState?.options)
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
  },
}
</script>
