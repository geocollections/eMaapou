<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field v-model="id" :label="$t(search.byIds.id.label)" />
    <!-- TODO: Get min and max dynamically -->
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
import RangeSearchField from './RangeSearchField.vue'
import ResetSearchButton from './ResetSearchButton.vue'
import SearchButton from './SearchButton.vue'

export default {
  name: 'AnalysisSearchForm',
  components: {
    TextSearchField,
    RangeSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('analysis', ['search']),
    ...mapFields('analysis', {
      id: 'search.byIds.id.value',
      depth: 'search.byIds.depth.value',
    }),
  },
  methods: {
    ...mapActions('analysis', ['searchAnalyses', 'resetAnalysisSearch']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetAnalysisSearch()
      this.searchAnalyses()
    },
    handleSearch(e) {
      this.searchAnalyses()
    },
  },
}
</script>
