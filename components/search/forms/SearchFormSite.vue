<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
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

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import InputText from '../../input/InputText.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default Vue.extend({
  name: 'SearchFormSite',
  components: {
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  computed: {
    ...mapState('search/site', ['filters', 'items']),
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
    handleReset() {
      this.$emit('reset')
    },
    handleSearch() {
      this.$emit('update')
    },
    handleMapUpdate() {
      this.$emit('update')
    },
  },
})
</script>
