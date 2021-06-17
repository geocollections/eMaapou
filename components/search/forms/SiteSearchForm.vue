<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('site')">
      <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
      <text-field v-model="area" :label="$t(filters.byIds.area.label)" />
      <text-field v-model="project" :label="$t(filters.byIds.project.label)" />
    </search-fields-wrapper>
    <search-view-map-wrapper
      site-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    />
    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import TextField from '../../fields/TextField.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import ExtraOptions from '~/components/search/ExtraOptions'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper.vue'

export default {
  name: 'SiteSearchForm',
  components: {
    ExtraOptions,
    TextField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
  },
  computed: {
    ...mapState('search/site', ['filters', 'count', 'items']),
    ...mapFields('search/site', {
      name: 'filters.byIds.name.value',
      latitude: 'filters.byIds.latitude.value',
      longitude: 'filters.byIds.longitude.value',
      area: 'filters.byIds.area.value',
      project: 'filters.byIds.project.value',
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
