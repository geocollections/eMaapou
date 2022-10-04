<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('site')">
      <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text v-model="area" :label="$t(filters.byIds.area.label)" />
      <input-text v-model="project" :label="$t(filters.byIds.project.label)" />
    </search-fields-wrapper>
    <search-map
      site-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'SearchFormSite',
  computed: {
    ...mapState('search/site', ['filters', 'count', 'items']),
    ...mapFields('search/site', {
      name: 'filters.byIds.name.value',
      latitude: 'filters.byIds.latitude.value',
      longitude: 'filters.byIds.longitude.value',
      area: 'filters.byIds.area.value',
      project: 'filters.byIds.project.value',
      query: 'query',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/site', ['searchSites']),
    handleSearch(e) {
      this.searchSites()
    },
    async handleReset(e) {
      await this.resetFilters('site')
      this.searchSites()
    },
    async handleMapUpdate(tableState) {
      await this.searchSites(tableState?.options)
    },
  },
}
</script>
