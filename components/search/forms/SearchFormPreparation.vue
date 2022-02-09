<template>
  <v-form @submit.prevent="handleSearch">
    <query-search-field v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('preparation')">
      <text-field v-model="number" :label="$t(filters.byIds.number.label)" />
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

      <range-text-field
        v-model="depth"
        :label="$t(filters.byIds.depth.label)"
      />
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
import { isEmpty } from 'lodash'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import TextField from '~/components/fields/TextField.vue'
import RangeTextField from '~/components/fields/RangeTextField.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import QuerySearchField from '~/components/fields/QuerySearchField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'SearchFormPreparation',
  components: {
    SearchInstitutionFilter,
    AutocompleteField,
    TextField,
    RangeTextField,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    QuerySearchField,
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
