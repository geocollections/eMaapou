<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
      <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
      <text-field
        v-model="repository"
        :label="$t(filters.byIds.repository.label)"
      />
      <text-field v-model="country" :label="$t(filters.byIds.country.label)" />
      <text-field v-model="storage" :label="$t(filters.byIds.storage.label)" />
      <range-text-field
        v-model="boxes"
        :label="$t(filters.byIds.boxes.label)"
      />
    </search-fields-wrapper>

    <search-view-map-wrapper
      borehole-overlay
      :active="geoJSON"
      :items="items"
      class="mt-2"
      @update="handleMapUpdate"
    />

    <institution-search-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'

import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter.vue'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import RangeTextField from '~/components/fields/RangeTextField.vue'
import TextField from '~/components/fields/TextField.vue'
import ExtraOptions from '~/components/search/ExtraOptions.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper.vue'

export default {
  name: 'DrillcoreSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    RangeTextField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
  },
  computed: {
    ...mapState('drillcore', ['filters', 'count', 'items']),
    ...mapFields('drillcore', {
      name: 'filters.byIds.name.value',
      repository: 'filters.byIds.repository.value',
      country: 'filters.byIds.country.value',
      boxes: 'filters.byIds.boxes.value',
      storage: 'filters.byIds.storage.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
      geoJSON: 'filters.byIds.geoJSON.value',
    }),
    ...mapGetters('drillcore', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('drillcore', ['searchDrillcores', 'resetDrillcoreFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetDrillcoreFilters()
      this.searchDrillcores()
    },
    handleSearch(e) {
      this.searchDrillcores()
    },
    async handleMapUpdate(tableState) {
      await this.searchDrillcores(tableState?.options)
    },
  },
}
</script>
