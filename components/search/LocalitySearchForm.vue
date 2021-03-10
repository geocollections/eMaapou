<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field v-model="name" :label="$t(search.byIds.name.label)" />

    <text-search-field
      v-model="country"
      :label="$t(search.byIds.country.label)"
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
    ...mapState('locality', ['search']),
    ...mapFields('locality', {
      name: 'search.byIds.name.value',
      country: 'search.byIds.country.value',
    }),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities', 'resetLocalitySearch']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchLocalities()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetLocalitySearch()
      this.searchLocalities()
    },
  },
}
</script>
