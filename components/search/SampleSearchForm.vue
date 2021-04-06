<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field
      v-model="number"
      :label="$t(filters.byIds.number.label)"
    />

    <text-search-field
      v-model="locality"
      :label="$t(filters.byIds.locality.label)"
    />

    <text-search-field
      v-model="stratigraphy"
      :label="$t(filters.byIds.stratigraphy.label)"
    />

    <autocomplete-search-field
      v-model="hierarchy"
      :items="autocomplete.stratigraphy"
      :loading="autocomplete.loaders.stratigraphy"
      :label="$t(filters.byIds.hierarchy.label)"
      :item-text="stratigraphyLabel"
      item-value="hierarchy_string"
      no-filter
      @search:items="autocompleteStratigraphySearch"
    />

    <text-search-field
      v-model="collector"
      :label="$t(filters.byIds.collector.label)"
    />

    <range-search-field
      v-model="depth"
      :min="-20"
      :max="5000"
      :label="$t(filters.byIds.depth.label)"
    />

    <text-search-field v-model="mass" :label="$t(filters.byIds.mass.label)" />

    <!--    <range-search-field-->
    <!--      v-model="mass"-->
    <!--      :min="0"-->
    <!--      :max="1000000"-->
    <!--      :label="$t(filters.byIds.mass.label)"-->
    <!--    />-->
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from './GlobalSearch.vue'
import TextSearchField from './TextSearchField.vue'
import ResetSearchButton from './ResetSearchButton.vue'
import SearchButton from './SearchButton.vue'
import RangeSearchField from './RangeSearchField'
import AutocompleteSearchField from '~/components/search/AutocompleteSearchField'
import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'SampleSearchForm',
  components: {
    AutocompleteSearchField,
    TextSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    RangeSearchField,
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
    ...mapState('sample', ['filters']),
    ...mapFields('sample', {
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
    }),
  },
  methods: {
    ...mapActions('sample', ['searchSamples', 'resetSampleFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSamples()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSampleFilters()
      this.searchSamples()
    },
  },
}
</script>
