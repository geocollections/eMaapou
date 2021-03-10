<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field v-model="name" :label="$t(search.byIds.name.label)" />
    <text-search-field
      v-model="repository"
      :label="$t(search.byIds.repository.label)"
    />
    <text-search-field
      v-model="country"
      :label="$t(search.byIds.country.label)"
    />
    <text-search-field
      v-model="storage"
      :label="$t(search.byIds.storage.label)"
    />
    <!-- TODO: Get min and max dynamically -->
    <range-search-field
      v-model="boxes"
      :min="0"
      :max="150"
      :label="$t(search.byIds.boxes.label)"
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
  name: 'DrillcoreSearchForm',
  components: {
    TextSearchField,
    RangeSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('drillcore', ['search']),
    ...mapFields('drillcore', {
      name: 'search.byIds.name.value',
      repository: 'search.byIds.repository.value',
      country: 'search.byIds.country.value',
      boxes: 'search.byIds.boxes.value',
      storage: 'search.byIds.storage.value',
    }),
  },
  methods: {
    ...mapActions('drillcore', ['searchDrillcores', 'resetDrillcoreSearch']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetDrillcoreSearch()
      this.searchDrillcores()
    },
    handleSearch(e) {
      this.searchDrillcores()
    },
  },
}
</script>
