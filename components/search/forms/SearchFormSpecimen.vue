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
      <input-autocomplete
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.hierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <input-text v-model="fossil" :label="$t(filters.byIds.fossil.label)" />
    </search-fields-wrapper>

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
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormSpecimen',
  components: {
    SearchInstitutionFilter,
    InputAutocomplete,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
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
    ...mapState('search/specimen', ['filters', 'count', 'items']),
    ...mapFields('search/specimen', {
      number: 'filters.byIds.number.value',
      collectionNr: 'filters.byIds.collectionNr.value',
      locality: 'filters.byIds.locality.value',
      fossil: 'filters.byIds.fossil.value',
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
