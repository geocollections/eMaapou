<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-search-field v-model="name" :label="$t(search.byIds.name.label)" />
    <range-search-field
      v-model="latitude"
      :min="-90"
      :max="90"
      :label="$t(search.byIds.latitude.label)"
    />
    <range-search-field
      v-model="longitude"
      :min="-180"
      :max="180"
      :label="$t(search.byIds.longitude.label)"
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
import RangeSearchField from './RangeSearchField.vue'

export default {
  name: 'SiteSearchForm',
  components: {
    TextSearchField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    RangeSearchField,
  },
  computed: {
    ...mapState('site', ['search']),
    ...mapFields('site', {
      name: 'search.byIds.name.value',
      latitude: 'search.byIds.latitude.value',
      longitude: 'search.byIds.longitude.value',
    }),
  },
  methods: {
    ...mapActions('site', ['searchSites', 'resetSiteSearch']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSites()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSiteSearch()
      this.searchSites()
    },
  },
}
</script>
