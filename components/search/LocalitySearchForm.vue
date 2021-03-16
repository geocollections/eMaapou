<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field v-model="name" :label="$t(filters.byIds.name.label)" />

    <text-search-field
      v-model="country"
      :label="$t(filters.byIds.country.label)"
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

export default {
  name: 'LocalitySearchForm',
  components: {
    TextSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('locality', ['filters']),
    ...mapFields('locality', {
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
    }),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities', 'resetLocalityFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchLocalities()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetLocalityFilters()
      this.searchLocalities()
    },
  },
}
</script>
