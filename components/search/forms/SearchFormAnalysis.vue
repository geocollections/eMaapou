<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('analysis')">
      <input-text v-model="id" :label="$t(filters.byIds.id.label)" />
      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />
    </search-fields-wrapper>

    <search-map
      :items="items"
      class="mt-2"
      :active="geoJSON"
      @update="handleMapUpdate"
    />
    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'SearchFormAnalysis',
  computed: {
    ...mapState('search/analysis', ['filters', 'count', 'items']),
    ...mapFields('search/analysis', {
      id: 'filters.byIds.id.value',
      depth: 'filters.byIds.depth.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/analysis', ['searchAnalyses']),
    async handleReset(e) {
      await this.resetFilters('analysis')
      this.searchAnalyses()
    },
    handleSearch(e) {
      this.searchAnalyses()
    },
    handleMapUpdate(tableState) {
      this.searchAnalyses(tableState?.options)
    },
  },
}
</script>
