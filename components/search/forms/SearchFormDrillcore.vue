<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('drillcore')">
      <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text
        v-model="repository"
        :label="$t(filters.byIds.repository.label)"
      />
      <input-text v-model="country" :label="$t(filters.byIds.country.label)" />
      <input-text v-model="storage" :label="$t(filters.byIds.storage.label)" />
      <input-range v-model="boxes" :label="$t(filters.byIds.boxes.label)" />
    </search-fields-wrapper>

    <search-map
      borehole-overlay
      :active="geoJSON !== null"
      :items="items"
      class="mt-2"
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

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputRange from '~/components/input/InputRange.vue'
import InputText from '~/components/input/InputText.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormDrillcore',
  components: {
    SearchInstitutionFilter,
    InputText,
    InputRange,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  computed: {
    ...mapState('search/drillcore', ['filters', 'count', 'items']),
    ...mapFields('search/drillcore', {
      name: 'filters.byIds.name.value',
      repository: 'filters.byIds.repository.value',
      country: 'filters.byIds.country.value',
      boxes: 'filters.byIds.boxes.value',
      storage: 'filters.byIds.storage.value',
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
    ...mapActions('search/drillcore', ['searchDrillcores']),
    async handleReset() {
      await this.resetFilters('drillcore')
      this.searchDrillcores()
    },
    handleSearch() {
      this.searchDrillcores()
    },
    handleMapUpdate(tableState) {
      this.searchDrillcores(tableState?.options)
    },
  },
}
</script>
