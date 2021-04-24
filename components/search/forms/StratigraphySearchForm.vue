<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="number" :label="$t(filters.byIds.id.label)" />

    <autocomplete-field
      v-model="hierarchy"
      :items="autocomplete.stratigraphy"
      :loading="autocomplete.loaders.stratigraphy"
      :label="$t(filters.byIds.stratigraphy.label)"
      :item-text="stratigraphyLabel"
      @search:items="autocompleteStratigraphySearch"
    />

    <text-field v-model="index" :label="$t(filters.byIds.index.label)" />

    <range-text-field v-model="age" :label="$t(filters.byIds.age.label)" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import RangeTextField from '~/components/fields/RangeTextField'

export default {
  name: 'StratigraphySearchForm',
  components: {
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    AutocompleteField,
    RangeTextField,
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
    ...mapState('stratigraphy', ['filters']),
    ...mapFields('stratigraphy', {
      number: 'filters.byIds.id.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      index: 'filters.byIds.index.value',
      age: 'filters.byIds.age.value',
    }),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('stratigraphy', [
      'searchStratigraphy',
      'resetStratigraphyFilters',
    ]),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchStratigraphy()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetStratigraphyFilters()
      this.searchStratigraphy()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
  },
}
</script>
