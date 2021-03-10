<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field
      v-model="number"
      :label="$t(search.byIds.number.label)"
    />

    <text-search-field
      v-model="stratigraphy"
      :label="$t(search.byIds.stratigraphy.label)"
    />
    <range-search-field
      v-model="depth"
      :min="-20"
      :max="5000"
      :label="$t(search.byIds.depth.label)"
    />
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

export default {
  name: 'SampleSearchForm',
  components: {
    TextSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    RangeSearchField,
  },
  computed: {
    ...mapState('sample', ['search']),
    ...mapFields('sample', {
      number: 'search.byIds.number.value',
      stratigraphy: 'search.byIds.stratigraphy.value',
      depth: 'search.byIds.depth.value',
    }),
  },
  methods: {
    ...mapActions('sample', ['searchSamples', 'resetSampleSearch']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSamples()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSampleSearch()
      this.searchSamples()
    },
  },
}
</script>
