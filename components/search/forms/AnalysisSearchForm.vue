<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right mt-2">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="id" :label="$t(filters.byIds.id.label)" />
    <!-- TODO: Get min and max dynamically -->
    <range-slider-field
      v-model="depth"
      :min="-20"
      :max="5000"
      :label="$t(filters.byIds.depth.label)"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import RangeSliderField from '~/components/fields/RangeSliderField.vue'
import TextField from '~/components/fields/TextField.vue'

export default {
  name: 'AnalysisSearchForm',
  components: {
    TextField,
    RangeSliderField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('analysis', ['filters']),
    ...mapFields('analysis', {
      id: 'filters.byIds.id.value',
      depth: 'filters.byIds.depth.value',
    }),
  },
  methods: {
    ...mapActions('analysis', ['searchAnalyses', 'resetAnalysisFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetAnalysisFilters()
      this.searchAnalyses()
    },
    handleSearch(e) {
      this.searchAnalyses()
    },
  },
}
</script>
