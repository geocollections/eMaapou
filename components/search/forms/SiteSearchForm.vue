<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
    <text-field v-model="area" :label="$t(filters.byIds.area.label)" />
    <text-field v-model="project" :label="$t(filters.byIds.project.label)" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import TextField from '../../fields/TextField.vue'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'

export default {
  name: 'SiteSearchForm',
  components: {
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('site', ['filters']),
    ...mapFields('site', {
      name: 'filters.byIds.name.value',
      latitude: 'filters.byIds.latitude.value',
      longitude: 'filters.byIds.longitude.value',
      area: 'filters.byIds.area.value',
      project: 'filters.byIds.project.value',
    }),
  },
  methods: {
    ...mapActions('site', ['searchSites', 'resetSiteFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSites()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSiteFilters()
      this.searchSites()
    },
  },
}
</script>
